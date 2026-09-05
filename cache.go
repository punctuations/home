package main

import (
	"sync"
	"time"
)

const (
	retryAfterFailure = 5 * time.Second
	refillTimeout     = 30 * time.Second
)

type memo[T any] struct {
	ttl   time.Duration
	load  func() T
	sound func(T) bool

	mu        sync.Mutex
	value     T
	stamped   time.Time
	holds     bool
	refilling time.Time
}

func (m *memo[T]) get() T {
	m.mu.Lock()
	defer m.mu.Unlock()

	if !m.holds {
		m.store(m.load())
		return m.value
	}

	if !m.sound(m.value) {
		if time.Since(m.stamped) >= retryAfterFailure {
			m.store(m.load())
		}
		return m.value
	}

	if time.Since(m.stamped) >= m.ttl && !m.busy() {
		m.refilling = time.Now()
		go m.refill()
	}

	return m.value
}

func (m *memo[T]) busy() bool {
	return !m.refilling.IsZero() && time.Since(m.refilling) < refillTimeout
}

func (m *memo[T]) refill() {
	fresh := m.load()

	m.mu.Lock()
	defer m.mu.Unlock()

	m.refilling = time.Time{}

	if m.sound(fresh) {
		m.store(fresh)
		return
	}

	m.stamped = time.Now().Add(retryAfterFailure - m.ttl)
}

func (m *memo[T]) store(value T) {
	m.value = value
	m.stamped = time.Now()
	m.holds = true
}

var (
	githubMemo = &memo[githubPreview]{
		ttl:   time.Hour,
		load:  fetchGithubPreview,
		sound: func(v githubPreview) bool { return v.Username != "" },
	}

	presenceMemo = &memo[presencePreview]{
		ttl:   time.Minute,
		load:  fetchPresencePreview,
		sound: func(v presencePreview) bool { return v.Username != "" },
	}
)
