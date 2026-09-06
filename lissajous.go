package main

import (
	"encoding/json"
	"fmt"
	"math"
	"strings"
)

type curve struct {
	A, B, C int
	Phase   float64
}

var site = curve{A: 5, B: 7, C: 9, Phase: 0.7}

const (
	ramp           = ".:-=+*#%@"
	samplesPerCell = 4
	markerSteps    = 240
)

func curveSettings() string {
	body, err := json.Marshal(map[string]any{
		"a":           site.A,
		"b":           site.B,
		"c":           site.C,
		"phase":       site.Phase,
		"ramp":        ramp,
		"samples":     samplesPerCell,
		"pitch":       maxPitch,
		"rest":        backgroundAngle,
		"markerRest":  restAngle,
		"markerSteps": markerSteps,
	})
	if err != nil {
		return ""
	}
	return string(body)
}

func (c curve) at(t float64) (x, y, z float64) {
	a, b, k := float64(c.A), float64(c.B), float64(c.C)
	return math.Cos(a * t), math.Cos(b*t + c.Phase), math.Cos(k*t + 2*c.Phase)
}

func (c curve) radius() float64 {
	const steps = 4096

	widest := 0.0
	for i := 0; i <= steps; i++ {
		px, _, pz := c.at(2 * math.Pi * float64(i) / steps)
		if reach := px*px + pz*pz; reach > widest {
			widest = reach
		}
	}
	return math.Sqrt(widest)
}

const maxPitch = 0.5

func (c curve) bounds() (rx, rz float64) {
	const steps = 4096

	for i := 0; i <= steps; i++ {
		x, y, z := c.at(2 * math.Pi * float64(i) / steps)

		flat := math.Hypot(x, z)
		if flat > rx {
			rx = flat
		}
		if full := math.Hypot(math.Abs(y), flat); full > rz {
			rz = full
		}
	}
	return rx, rz
}

func (c curve) profile() (high, flat []float64) {
	const steps = 2048

	high = make([]float64, steps+1)
	flat = make([]float64, steps+1)

	for i := range high {
		x, y, z := c.at(2 * math.Pi * float64(i) / steps)
		high[i] = math.Abs(y)
		flat[i] = math.Hypot(x, z)
	}
	return high, flat
}

var siteRadius = site.radius()

var siteRX, siteRZ = site.bounds()

var siteHigh, siteFlat = site.profile()

func verticalExtent(pitch float64) float64 {
	sin, cos := math.Sincos(pitch)
	sin, cos = math.Abs(sin), math.Abs(cos)

	widest := 0.0
	for i, high := range siteHigh {
		if reach := high*cos + siteFlat[i]*sin; reach > widest {
			widest = reach
		}
	}
	return widest
}

func Path(a, b, c int, phase, theta float64) string {
	const steps = markerSteps

	shape := curve{a, b, c, phase}
	sin, cos := math.Sincos(theta)
	reach := shape.radius()

	var d strings.Builder
	for i := 0; i <= steps; i++ {
		px, py, pz := shape.at(2 * math.Pi * float64(i) / steps)
		x := (px*cos + pz*sin) / reach

		if i == 0 {
			fmt.Fprintf(&d, "M%.3f %.3f", x, -py)
			continue
		}
		fmt.Fprintf(&d, "L%.3f %.3f", x, -py)
	}
	return d.String()
}

func ASCII(w, h int, yaw, pitch float64) string {
	if w < 2 || h < 2 {
		return ""
	}

	cells := make([]byte, w*h)
	depths := make([]float64, w*h)
	for i := range cells {
		cells[i] = ' '
		depths[i] = math.Inf(-1)
	}

	steps := w * h * samplesPerCell
	sinYaw, cosYaw := math.Sincos(yaw)
	sinPitch, cosPitch := math.Sincos(pitch)
	tall := verticalExtent(pitch)

	for i := 0; i <= steps; i++ {
		px, py, pz := site.at(2 * math.Pi * float64(i) / float64(steps))

		flatX := px*cosYaw + pz*sinYaw
		flatZ := pz*cosYaw - px*sinYaw

		x := flatX / siteRX
		y := (py*cosPitch - flatZ*sinPitch) / tall
		depth := (py*sinPitch + flatZ*cosPitch) / siteRZ

		col := int(math.Round((x + 1) / 2 * float64(w-1)))
		row := int(math.Round((1 - (y+1)/2) * float64(h-1)))
		if col < 0 || col >= w || row < 0 || row >= h {
			continue
		}

		at := row*w + col
		if depth <= depths[at] {
			continue
		}

		depths[at] = depth
		cells[at] = shade(depth)
	}

	var out strings.Builder
	for row := range h {
		out.WriteString(string(cells[row*w : (row+1)*w]))
		if row < h-1 {
			out.WriteByte(10)
		}
	}
	return out.String()
}

func shade(depth float64) byte {
	level := int(math.Round((depth + 1) / 2 * float64(len(ramp)-1)))
	if level < 0 {
		level = 0
	}
	if level >= len(ramp) {
		level = len(ramp) - 1
	}
	return ramp[level]
}
