package main

import (
	"fmt"
	"net/http"
	"strings"
)

var indexed = []string{"/", "/~matthew", "/receipt", "/guestbook"}

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
