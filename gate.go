package main

import (
	"net"
	"net/http"
	"strings"
	"sync"
	"time"
)

const (
	signWindow = time.Minute
	signBurst  = 6
	gateMax    = 8192
)

type spell struct {
	count int
	until time.Time
}

type gate struct {
	window time.Duration
	burst  int

	mu   sync.Mutex
	seen map[string]*spell
}

func newGate(window time.Duration, burst int) *gate {
	return &gate{window: window, burst: burst, seen: map[string]*spell{}}
}

func (g *gate) allow(who string) bool {
	now := time.Now()

	g.mu.Lock()
	defer g.mu.Unlock()

	if len(g.seen) > gateMax {
		for key, at := range g.seen {
			if now.After(at.until) {
				delete(g.seen, key)
			}
		}
		if len(g.seen) > gateMax {
			g.seen = map[string]*spell{}
		}
	}

	at, ok := g.seen[who]
	if !ok || now.After(at.until) {
		g.seen[who] = &spell{count: 1, until: now.Add(g.window)}
		return true
	}

	at.count++
	return at.count <= g.burst
}

var signGate = newGate(signWindow, signBurst)

func caller(r *http.Request) string {
	if real := strings.TrimSpace(r.Header.Get("X-Real-IP")); real != "" {
		return real
	}

	if forwarded := r.Header.Get("X-Forwarded-For"); forwarded != "" {
		if first, _, found := strings.Cut(forwarded, ","); found {
			return strings.TrimSpace(first)
		}
		return strings.TrimSpace(forwarded)
	}

	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}
