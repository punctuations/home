package main

import (
	"net/http"
	"strings"
)

const unsettledCache = "public, max-age=0, s-maxage=15"

func cacheFor(settled bool, full string) string {
	if settled {
		return full
	}
	return unsettledCache
}
func wantsPlain(w http.ResponseWriter, r *http.Request) bool {
	if acceptsHTML(r.Header.Get("Accept")) {
		w.Header().Set("Vary", "Accept")
		return false
	}

	w.Header().Set("Vary", "Accept, User-Agent")
	return terminal(r.UserAgent())
}
func acceptsHTML(accept string) bool {
	for _, kind := range strings.Split(accept, ",") {
		if at := strings.IndexByte(kind, ';'); at >= 0 {
			kind = kind[:at]
		}

		switch strings.ToLower(strings.TrimSpace(kind)) {
		case "text/html", "application/xhtml+xml":
			return true
		}
	}
	return false
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
func canonical(r *http.Request) bool {
	host := r.Host
	if at := strings.IndexByte(host, ':'); at >= 0 {
		host = host[:at]
	}
	return strings.EqualFold(host, canonicalHost)
}
func trimPath(path string) string {
	const longest = 64

	if len(path) > longest {
		return path[:longest] + "..."
	}
	return path
}
