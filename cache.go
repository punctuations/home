package main

import (
	"sync"
	"time"
)

const retryAfterFailure = 15 * time.Second

type memo[T any] struct {
	ttl   time.Duration
	load  func() T
	sound func(T) bool

	mu        sync.Mutex
	value     T
	stamped   time.Time
	holds     bool
	refilling bool
}

func (m *memo[T]) get() T {
	m.mu.Lock()
	defer m.mu.Unlock()

	if !m.holds {
		m.store(m.load())
		return m.value
	}

	if time.Since(m.stamped) >= m.life() && !m.refilling {
		m.refilling = true
		go m.refill()
	}

	return m.value
}

func (m *memo[T]) refill() {
	fresh := m.load()

	m.mu.Lock()
	defer m.mu.Unlock()

	m.refilling = false
	if m.sound(fresh) || !m.sound(m.value) {
		m.store(fresh)
	} else {
		m.stamped = time.Now().Add(retryAfterFailure - m.ttl)
	}
}

func (m *memo[T]) store(value T) {
	m.value = value
	m.stamped = time.Now()
	m.holds = true
}

func (m *memo[T]) life() time.Duration {
	if m.sound(m.value) {
		return m.ttl
	}
	return retryAfterFailure
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
