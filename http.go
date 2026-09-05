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
