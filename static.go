package main

import (
	"crypto/sha256"
	"encoding/hex"
	"io/fs"
	"net/http"
)

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
