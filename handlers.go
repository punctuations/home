package main

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	htmltemplate "html/template"
	"io/fs"
	"net/http"
	"strings"
	"time"
	_ "time/tzdata"
)

const (
	discordID       = "291050399509774340"
	contactEmail    = "contact@thew.sh"
	displayName     = "Matthew"
	location        = "Vancouver, BC"
	studyURL        = "/~matthew"
	timezone        = "America/Vancouver"
	canonicalHost   = "thew.sh"
	summary         = "Algorithms, optimization, and compression"
	themeColor      = "#1B1A17"
	asciiWidth      = 114
	asciiHeight     = 48
	restAngle       = 0.6
	backgroundAngle = 0.30
)

func zone() *time.Location {
	loc, err := time.LoadLocation(timezone)
	if err != nil {
		return time.UTC
	}
	return loc
}

func localTime() string {
	return time.Now().In(zone()).Format("3:04pm")
}

type mark struct {
	Project
	Path string
}

var assetVersions = hashAssets()

func hashAssets() map[string]string {
	versions := make(map[string]string)

	fs.WalkDir(staticFS, "static", func(path string, entry fs.DirEntry, err error) error {
		if err != nil || entry.IsDir() {
			return err
		}

		body, err := staticFS.ReadFile(path)
		if err != nil {
			return err
		}

		sum := sha256.Sum256(body)
		versions["/"+path] = hex.EncodeToString(sum[:])[:10]
		return nil
	})

	return versions
}

func asset(name string) string {
	path := "/static/" + name

	version, ok := assetVersions[path]
	if !ok {
		return path
	}
	return path + "?v=" + version
}

var indexed = []string{"/", "/~matthew", "/receipt", "/guestbook"}

const unsettledCache = "public, max-age=0, s-maxage=15"

func cacheFor(settled bool, full string) string {
	if settled {
		return full
	}
	return unsettledCache
}

var shortlinks = map[string]string{
	"/github":  "https://github.com/aamtt",
	"/twitter": "https://twitter.com/0xA5A5",
	"/x":       "https://x.com/0xA5A5",
	"/discord": "https://discord.gg/R3QtA68Cbf",
}

func structuredData() htmltemplate.JS {
	profile := map[string]any{
		"@context":    "https://schema.org",
		"@type":       "Person",
		"name":        displayName,
		"url":         "https://" + canonicalHost + "/",
		"description": summary,
		"image":       "https://" + canonicalHost + "/og.png?v=" + ogTag,
		"sameAs":      []string{shortlinks["/github"], shortlinks["/twitter"]},
		"homeLocation": map[string]string{
			"@type": "Place",
			"name":  location,
		},
		"affiliation": map[string]string{
			"@type": "CollegeOrUniversity",
			"name":  "University of British Columbia",
		},
	}

	body, err := json.Marshal(profile)
	if err != nil {
		return ""
	}
	return htmltemplate.JS(body)
}

type view struct {
	Name         string
	Location     string
	LocationURL  string
	LocalTime    string
	Timezone     string
	Description  string
	ThemeColor   string
	CanonicalURL string
	OpenGraphURL string
	Structured   htmltemplate.JS
	StudyURL     string
	Email        string
	DiscordID    string
	Year         int
	Curve        string
	CurveWidth   int
	CurveHeight  int
	Github       githubPreview
	Presence     presencePreview
	Projects     []mark
	Elsewhere    []mark
	Home         bool
}

func (v view) settled() bool {
	return v.Presence.Username != "" && v.Github.Username != ""
}

func page() view {
	marks := make([]mark, len(projects))
	for i, p := range projects {
		marks[i] = mark{Project: p, Path: Path(p.A, p.B, p.C, p.Phase, restAngle)}
	}

	links := make([]mark, len(elsewhere))
	for i, p := range elsewhere {
		links[i] = mark{Project: p, Path: Path(p.A, p.B, p.C, p.Phase, restAngle)}
	}

	return view{
		Name:         displayName,
		Location:     location,
		LocalTime:    localTime(),
		Timezone:     timezone,
		Description:  summary,
		ThemeColor:   themeColor,
		CanonicalURL: "https://" + canonicalHost + "/",
		OpenGraphURL: "https://" + canonicalHost + "/og.png?v=" + ogTag,
		Structured:   structuredData(),
		StudyURL:     studyURL,
		Email:        contactEmail,
		DiscordID:    discordID,
		Year:         time.Now().In(zone()).Year(),
		Curve:        ASCII(asciiWidth, asciiHeight, backgroundAngle, 0),
		CurveWidth:   asciiWidth,
		CurveHeight:  asciiHeight,
		Github:       githubMemo.get(),
		Presence:     presenceMemo.get(),
		Projects:     marks,
		Elsewhere:    links,
	}
}

func wantsPlain(w http.ResponseWriter, r *http.Request) bool {
	w.Header().Set("Vary", "User-Agent")
	return terminal(r.UserAgent())
}

func terminal(agent string) bool {
	agent = strings.ToLower(agent)
	for _, name := range []string{"curl", "wget", "httpie"} {
		if strings.Contains(agent, name) {
			return true
		}
	}
	return false
}

func root(w http.ResponseWriter, r *http.Request) {
	data := page()

	if wantsPlain(w, r) {
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		w.Header().Set("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=86400")
		plainTemplate.ExecuteTemplate(w, "plain.txt", data)
		return
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Cache-Control", cacheFor(data.settled(), "public, max-age=0, s-maxage=300, stale-while-revalidate=86400"))
	pageTemplate.ExecuteTemplate(w, "index.html", data)
}

func shortlink(w http.ResponseWriter, r *http.Request) {
	target, ok := shortlinks[r.URL.Path]
	if !ok {
		notFound(w, r)
		return
	}

	w.Header().Set("Cache-Control", "public, max-age=3600, s-maxage=86400")
	http.Redirect(w, r, target, http.StatusFound)
}

func assets() http.Handler {
	files := http.FileServerFS(staticFS)

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if version, ok := assetVersions[r.URL.Path]; ok {
			w.Header().Set("ETag", `"`+version+`"`)
		}

		if r.URL.Query().Get("v") != "" {
			w.Header().Set("Cache-Control", "public, max-age=31536000, s-maxage=31536000, immutable")
		} else {
			w.Header().Set("Cache-Control", "public, max-age=0, must-revalidate")
		}

		files.ServeHTTP(w, r)
	})
}

type research struct {
	Title      string
	Status     string
	InProgress bool
}

var papers = []research{
	{Title: "Graph neural networks", Status: "in progress, no preprint", InProgress: true},
	{Title: "Optimization", Status: "in progress, no preprint", InProgress: true},
}

type academicView struct {
	Papers       []research
	CanonicalURL string
}

func academic(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Cache-Control", "public, max-age=0, s-maxage=3600")

	if wantsPlain(w, r) {
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		fmt.Fprint(w, "  M. BAKER\n  Optimization & Graph Theory\n\n")
		fmt.Fprint(w, "  I work on optimization and graph theory, and on the\n  intersection between them.\n\n  RESEARCH\n")
		for n, item := range papers {
			fmt.Fprintf(w, "    [%d] %s\n        %s\n", n+1, item.Title, item.Status)
		}
		fmt.Fprintf(w, "\n  m [at] thew [dot] sh / https://%s/\n", canonicalHost)
		return
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	academicTemplate.ExecuteTemplate(w, "matthew.html", academicView{
		Papers:       papers,
		CanonicalURL: "https://" + canonicalHost + "/~matthew",
	})
}

func receipt(w http.ResponseWriter, r *http.Request) {
	body, err := homeFS.ReadFile("home/index.html")
	if err != nil {
		notFound(w, r)
		return
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Cache-Control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400")
	w.Write(body)
}

func exported() http.Handler {
	files, err := fs.Sub(homeFS, "home")
	if err != nil {
		panic(err)
	}
	handler := http.FileServerFS(files)

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "public, max-age=31536000, s-maxage=31536000, immutable")
		http.StripPrefix("/receipt/", handler).ServeHTTP(w, r)
	})
}

type guestbookView struct {
	view
	Origin    string
	Namespace string
	Signers   []signer
}

func guestbook(w http.ResponseWriter, r *http.Request) {
	data := page()
	data.CanonicalURL = "https://" + canonicalHost + "/guestbook"
	data.Home = true

	list := signers()

	if wantsPlain(w, r) {
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		w.Header().Set("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=86400")
		if len(list) == 0 {
			fmt.Fprintf(w, "    Nobody has signed yet.\n")
			return
		}

		for _, entry := range list {
			fmt.Fprintf(w, "    %s  %s\n", entry.Signed(), entry.Display())
		}
		return
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Cache-Control", cacheFor(data.settled(), "public, max-age=0, s-maxage=60, stale-while-revalidate=86400"))
	guestbookTemplate.ExecuteTemplate(w, "guestbook.html", guestbookView{
		view:      data,
		Origin:    "https://" + canonicalHost,
		Namespace: signNamespace,
		Signers:   list,
	})
}

type errorView struct {
	Home      bool
	Path      string
	Name      string
	Year      int
	DiscordID string
	Github    githubPreview
	Presence  presencePreview
}

func notFound(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Cache-Control", "public, max-age=0, s-maxage=60")

	if wantsPlain(w, r) {
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprintf(w, "  Not Found\n\n  There is nothing at %s\n\n  https://%s/\n", trimPath(r.URL.Path), canonicalHost)
		return
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.WriteHeader(http.StatusNotFound)

	errorTemplate.ExecuteTemplate(w, "404.html", errorView{
		Path:      trimPath(r.URL.Path),
		Name:      displayName,
		Year:      time.Now().In(zone()).Year(),
		DiscordID: discordID,
		Github:    githubMemo.get(),
		Presence:  presenceMemo.get(),
	})
}

func trimPath(path string) string {
	const longest = 64

	if len(path) > longest {
		return path[:longest] + "..."
	}
	return path
}

func canonical(r *http.Request) bool {
	host := r.Host
	if at := strings.IndexByte(host, ':'); at >= 0 {
		host = host[:at]
	}
	return strings.EqualFold(host, canonicalHost)
}

func favicon(w http.ResponseWriter, r *http.Request) {
	body, err := staticFS.ReadFile("static/favicon.ico")
	if err != nil {
		notFound(w, r)
		return
	}

	w.Header().Set("Content-Type", "image/x-icon")
	w.Header().Set("Cache-Control", "public, max-age=86400, s-maxage=604800")
	w.Write(body)
}

func robots(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	w.Header().Set("Cache-Control", "public, max-age=0, s-maxage=3600")

	if !canonical(r) {
		w.Write([]byte("User-agent: *\nDisallow: /\n"))
		return
	}

	fmt.Fprintf(w, "User-agent: *\nAllow: /\n\nSitemap: https://%s/sitemap.xml\n", canonicalHost)
}

func sitemap(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/xml; charset=utf-8")
	w.Header().Set("Cache-Control", "public, max-age=0, s-maxage=3600")

	var out strings.Builder
	out.WriteString(`<?xml version="1.0" encoding="UTF-8"?>` + "\n")
	out.WriteString(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` + "\n")

	for _, path := range indexed {
		fmt.Fprintf(&out, "  <url><loc>https://%s%s</loc></url>\n", canonicalHost, path)
	}

	out.WriteString("</urlset>\n")
	w.Write([]byte(out.String()))
}
