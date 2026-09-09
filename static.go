package main

import (
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"io/fs"
	"net/http"
	"strings"
	"time"
)

var assetVersions, stylesheets = buildAssets()

func buildAssets() (map[string]string, map[string][]byte) {
	versions := hashAssets()
	sheets := make(map[string][]byte)

	for name := range versions {
		if !strings.HasSuffix(name, ".css") {
			continue
		}

		body, err := staticFS.ReadFile(strings.TrimPrefix(name, "/"))
		if err != nil {
			continue
		}

		sheets[name] = versionedURLs(body, versions)
	}

	for name, body := range sheets {
		versions[name] = digest(body)
	}

	return versions, sheets
}
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

		versions["/"+path] = digest(body)
		return nil
	})

	return versions
}
func versionedURLs(body []byte, versions map[string]string) []byte {
	for name, version := range versions {
		body = bytes.ReplaceAll(body,
			[]byte(`url("`+name+`")`),
			[]byte(`url("`+name+`?v=`+version+`")`))
	}

	return body
}
func digest(body []byte) string {
	sum := sha256.Sum256(body)
	return hex.EncodeToString(sum[:])[:10]
}
func asset(name string) string {
	path := "/static/" + name

	version, ok := assetVersions[path]
	if !ok {
		return path
	}
	return path + "?v=" + version
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

		if sheet, ok := stylesheets[r.URL.Path]; ok {
			w.Header().Set("Content-Type", "text/css; charset=utf-8")
			http.ServeContent(w, r, r.URL.Path, time.Time{}, bytes.NewReader(sheet))
			return
		}

		files.ServeHTTP(w, r)
	})
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
