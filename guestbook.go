package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"regexp"
	"sort"
	"strings"
	"time"
)

const (
	signNamespace = "guestbook@thew.sh"
	signKey       = "guestbook"
	blockedKey    = "guestbook:blocked"
	maxEntryBytes = 4096
)

var loginShape = regexp.MustCompile(`^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$`)

var errNoStore = errors.New("guestbook storage is not configured")

type signer struct {
	Login string `json:"login"`
	Name  string `json:"name"`
	At    int64  `json:"at"`
}

type authorizedKey struct {
	Line   string
	Source string
}

func (s signer) Display() string {
	name := plain(s.Name)
	if name == "" || strings.EqualFold(name, s.Login) {
		return s.Login
	}
	return fmt.Sprintf("%s (%s)", s.Login, name)
}

func (s signer) Signed() string {
	return time.Unix(s.At, 0).In(zone()).Format("2006-01-02")
}

func firstEnv(names ...string) string {
	for _, name := range names {
		if value := strings.TrimSpace(os.Getenv(name)); value != "" {
			return value
		}
	}
	return ""
}

func redisCall(args ...string) (json.RawMessage, error) {
	base := strings.TrimSuffix(firstEnv("KV_REST_API_URL", "UPSTASH_REDIS_REST_URL"), "/")
	token := firstEnv("KV_REST_API_TOKEN", "UPSTASH_REDIS_REST_TOKEN")
	if base == "" || token == "" {
		return nil, errNoStore
	}

	body, err := json.Marshal(args)
	if err != nil {
		return nil, err
	}

	request, err := http.NewRequest(http.MethodPost, base, bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	request.Header.Set("Authorization", "Bearer "+token)
	request.Header.Set("Content-Type", "application/json")

	response, err := (&http.Client{Timeout: 5 * time.Second}).Do(request)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	var payload struct {
		Result json.RawMessage `json:"result"`
		Error  string          `json:"error"`
	}
	if err := json.NewDecoder(response.Body).Decode(&payload); err != nil {
		return nil, err
	}
	if payload.Error != "" {
		return nil, errors.New(payload.Error)
	}
	return payload.Result, nil
}

func signers() []signer {
	raw, err := redisCall("HGETALL", signKey)
	if err != nil {
		return nil
	}

	var flat []string
	if err := json.Unmarshal(raw, &flat); err != nil {
		return nil
	}

	list := make([]signer, 0, len(flat)/2)
	for i := 0; i+1 < len(flat); i += 2 {
		var entry signer
		if json.Unmarshal([]byte(flat[i+1]), &entry) != nil {
			continue
		}
		if entry.Login == "" {
			entry.Login = flat[i]
		}
		entry.Name = plain(entry.Name)
		list = append(list, entry)
	}

	sort.Slice(list, func(a, b int) bool {
		if list[a].At != list[b].At {
			return list[a].At < list[b].At
		}
		return list[a].Login < list[b].Login
	})
	return list
}

func blocked(login string) (bool, error) {
	raw, err := redisCall("SISMEMBER", blockedKey, login)
	if err != nil {
		return false, err
	}

	var flag int
	if err := json.Unmarshal(raw, &flag); err != nil {
		return false, err
	}
	return flag == 1, nil
}

func alreadySigned(login string) (bool, error) {
	raw, err := redisCall("HEXISTS", signKey, login)
	if err != nil {
		return false, err
	}

	var flag int
	if err := json.Unmarshal(raw, &flag); err != nil {
		return false, err
	}
	return flag == 1, nil
}

func signerCount() int {
	raw, err := redisCall("HLEN", signKey)
	if err != nil {
		return 0
	}

	var total int
	if json.Unmarshal(raw, &total) != nil {
		return 0
	}
	return total
}

func addSigner(held string, entry signer) error {
	body, err := json.Marshal(entry)
	if err != nil {
		return err
	}
	_, err = redisCall("HSET", signKey, held, string(body))
	return err
}

func publishedKeys(login string) []authorizedKey {
	keys := []authorizedKey{}

	if body, err := fetchText("https://github.com/" + login + ".keys"); err == nil {
		for _, line := range strings.Split(body, "\n") {
			if strings.TrimSpace(line) != "" {
				keys = append(keys, authorizedKey{Line: line, Source: "authentication key on github.com/" + login})
			}
		}
	}

	if body, err := fetchText("https://api.github.com/users/" + login + "/ssh_signing_keys"); err == nil {
		var published []struct {
			Key string `json:"key"`
		}
		if json.Unmarshal([]byte(body), &published) == nil {
			for _, item := range published {
				if strings.TrimSpace(item.Key) != "" {
					keys = append(keys, authorizedKey{Line: item.Key, Source: "signing key on github.com/" + login})
				}
			}
		}
	}

	return keys
}

func fetchText(url string) (string, error) {
	request, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return "", err
	}
	request.Header.Set("Accept", "application/vnd.github+json")
	if token := os.Getenv("GITHUB_TOKEN"); token != "" && strings.Contains(url, "api.github.com") {
		request.Header.Set("Authorization", "Bearer "+token)
	}

	response, err := (&http.Client{Timeout: 5 * time.Second}).Do(request)
	if err != nil {
		return "", err
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return "", fmt.Errorf("github returned %d", response.StatusCode)
	}

	body, err := io.ReadAll(io.LimitReader(response.Body, 64<<10))
	return string(body), err
}

func account(login string) string {
	return strings.ToLower(login)
}

const longestName = 64

func plain(text string) string {
	stripped := strings.Map(func(r rune) rune {
		switch {
		case r < 0x20, r == 0x7F:
			return -1
		case r >= 0x80 && r <= 0x9F:
			return -1
		case r >= 0x200B && r <= 0x200F:
			return -1
		case r >= 0x202A && r <= 0x202E:
			return -1
		case r >= 0x2066 && r <= 0x2069:
			return -1
		}
		return r
	}, text)

	stripped = strings.TrimSpace(stripped)

	if runes := []rune(stripped); len(runes) > longestName {
		return strings.TrimSpace(string(runes[:longestName])) + "…"
	}
	return stripped
}

func profile(login string) (string, string) {
	body, err := fetchText("https://api.github.com/users/" + login)
	if err != nil {
		return "", ""
	}

	var found struct {
		Login string `json:"login"`
		Name  string `json:"name"`
	}
	if json.Unmarshal([]byte(body), &found) != nil {
		return "", ""
	}
	return found.Login, plain(found.Name)
}

func expectedMessages(login string) [][]byte {
	messages := make([][]byte, 0, 6)
	for _, prefix := range [][]byte{nil, byteOrderMark} {
		for _, ending := range []string{"\n", "\r\n", ""} {
			messages = append(messages, append(append([]byte{}, prefix...), login+ending...))
		}
	}
	return messages
}

func signedBy(claim *signedClaim, login string) bool {
	for _, message := range expectedMessages(login) {
		if claim.verify(message, signNamespace) == nil {
			return true
		}
	}
	return false
}

func signRecipe(host string) string {
	return fmt.Sprintf(`  Sign it with the SSH key on your GitHub account:

    echo YOURNAME \
      | ssh-keygen -Y sign -n %s -f ~/.ssh/id_ed25519 - \
      | curl -sX POST --data-binary @- '%s/sign?user=YOURNAME'

  In PowerShell, use a backtick to continue each line, $HOME instead
  of ~, and curl.exe so the alias for Invoke-WebRequest is bypassed.

  Replace YOURNAME with your GitHub username. The key must be
  published on your account, as either a signing or an auth key.

    %s/guestbook
`, signNamespace, host, host)
}

func signInstructions(host string) string {
	return "  Guestbook\n\n" + signRecipe(host)
}

func signReceipt(entry signer, claim *signedClaim, key authorizedKey, position int) string {
	var out strings.Builder

	fmt.Fprintf(&out, "  Signed. Welcome, %s.\n\n", entry.Display())
	fmt.Fprintf(&out, "    key         %s %s\n", claim.algorithm(), claim.fingerprint())
	fmt.Fprintf(&out, "    matched     %s\n", key.Source)
	fmt.Fprintf(&out, "    namespace   %s\n", signNamespace)
	fmt.Fprintf(&out, "    digest      %s\n", claim.digest())
	fmt.Fprintf(&out, "    recorded    %s\n", time.Unix(entry.At, 0).In(zone()).Format("2006-01-02 15:04:05 MST"))
	if position > 0 {
		fmt.Fprintf(&out, "    position    #%d\n", position)
	}
	fmt.Fprintf(&out, "\n    https://%s/guestbook\n", canonicalHost)

	return out.String()
}

func signPage(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	w.Header().Set("Cache-Control", "public, max-age=0, s-maxage=300")
	fmt.Fprint(w, signInstructions("https://"+canonicalHost))
}

func signSubmit(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")

	if !signGate.allow(caller(r)) {
		w.Header().Set("Retry-After", "60")
		refuse(w, http.StatusTooManyRequests, "too many attempts, wait a minute")
		return
	}

	login := strings.TrimSpace(r.URL.Query().Get("user"))
	if !loginShape.MatchString(login) {
		refuse(w, http.StatusBadRequest, "pass ?user=<github username>")
		return
	}

	armored, err := io.ReadAll(io.LimitReader(r.Body, maxEntryBytes))
	if err != nil || len(armored) == 0 {
		refuse(w, http.StatusBadRequest, "send the ssh signature as the request body")
		return
	}

	claim, err := parseSignature(armored)
	if err != nil {
		refuse(w, http.StatusBadRequest, "could not read that as an ssh signature")
		return
	}

	if !signedBy(claim, login) {
		refuse(w, http.StatusUnauthorized, "signature does not match \""+login+"\"")
		return
	}

	held := account(login)

	denied, err := blocked(held)
	if err != nil {
		refuse(w, http.StatusServiceUnavailable, "could not reach the guestbook right now, try again")
		return
	}
	if denied {
		refuse(w, http.StatusForbidden, "that account cannot sign")
		return
	}

	signed, err := alreadySigned(held)
	if err != nil {
		refuse(w, http.StatusServiceUnavailable, "could not reach the guestbook right now, try again")
		return
	}
	if signed {
		fmt.Fprintf(w, "  %s already signed. Thanks anyway.\n\n    https://%s/guestbook\n", held, canonicalHost)
		return
	}

	keys := publishedKeys(login)
	if len(keys) == 0 {
		refuse(w, http.StatusUnauthorized, "github publishes no ssh keys for "+login)
		return
	}
	key, ok := claim.matches(keys)
	if !ok {
		refuse(w, http.StatusUnauthorized, "that key is not published on github for "+login)
		return
	}

	shown, name := profile(login)
	if shown == "" {
		shown = held
	}

	entry := signer{Login: shown, Name: name, At: time.Now().Unix()}
	if err := addSigner(held, entry); err != nil {
		refuse(w, http.StatusServiceUnavailable, "could not save that right now")
		return
	}

	fmt.Fprint(w, signReceipt(entry, claim, key, signerCount()))
}

func refuse(w http.ResponseWriter, status int, reason string) {
	w.WriteHeader(status)
	fmt.Fprintf(w, "  %s\n\n%s", reason, signRecipe("https://"+canonicalHost))
}
