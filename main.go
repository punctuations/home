package main

import (
	"embed"
	htmltemplate "html/template"
	"log"
	"net/http"
	"os"
	texttemplate "text/template"

	"github.com/joho/godotenv"
)

//go:embed templates
var templateFS embed.FS

//go:embed static
var staticFS embed.FS

//go:embed all:archive
var archiveFS embed.FS

var (
	pageTemplate = htmltemplate.Must(htmltemplate.New("index.html").
			Funcs(htmltemplate.FuncMap{"asset": asset}).
			ParseFS(templateFS, "templates/index.html", "templates/footer.html", "templates/signature.html"))
	errorTemplate = htmltemplate.Must(htmltemplate.New("404.html").
			Funcs(htmltemplate.FuncMap{"asset": asset}).
			ParseFS(templateFS, "templates/404.html", "templates/footer.html", "templates/signature.html"))
	academicTemplate = htmltemplate.Must(htmltemplate.New("matthew.html").
				Funcs(htmltemplate.FuncMap{
			"asset": asset,
			"inc":   func(n int) int { return n + 1 },
		}).
		ParseFS(templateFS, "templates/matthew.html"))
	guestbookTemplate = htmltemplate.Must(htmltemplate.New("guestbook.html").
				Funcs(htmltemplate.FuncMap{"asset": asset}).
				ParseFS(templateFS, "templates/guestbook.html", "templates/footer.html", "templates/signature.html"))
	plainTemplate = texttemplate.Must(texttemplate.ParseFS(templateFS, "templates/plain.txt"))
)

func main() {
	if err := godotenv.Load(".env.local"); err != nil && !os.IsNotExist(err) {
		log.Printf("could not load .env.local: %v", err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("GET /{$}", root)
	mux.Handle("GET /static/", assets())
	for path := range shortlinks {
		mux.HandleFunc("GET "+path, shortlink)
	}
	mux.HandleFunc("GET /~matthew", academic)
	mux.HandleFunc("GET /guestbook", guestbook)
	mux.HandleFunc("GET /sign", signPage)
	mux.HandleFunc("POST /sign", signSubmit)
	mux.HandleFunc("GET /receipt", receipt)
	mux.Handle("GET /receipt/", exported())
	mux.HandleFunc("GET /og.png", openGraph)
	mux.HandleFunc("GET /favicon.ico", favicon)
	mux.HandleFunc("GET /robots.txt", robots)
	mux.HandleFunc("GET /sitemap.xml", sitemap)
	mux.HandleFunc("/", notFound)

	go githubMemo.get()
	go presenceMemo.get()

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Printf("listening on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, guarded(mux)))
}

func guarded(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		head := w.Header()
		head.Set("X-Content-Type-Options", "nosniff")
		head.Set("Referrer-Policy", "strict-origin-when-cross-origin")
		head.Set("X-Frame-Options", "DENY")
		head.Set("Content-Security-Policy", "frame-ancestors 'none'")
		next.ServeHTTP(w, r)
	})
}
