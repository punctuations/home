package main

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"math"
	"net/http"
	"strings"
)

const (
	portraitGCa     = 4.4
	portraitGK      = 8
	portraitGLeak   = 2
	portraitECa     = 120
	portraitEK      = -84
	portraitELeak   = -60
	portraitCap     = 20
	portraitV1      = -1.2
	portraitV2      = 18
	portraitV3      = 2
	portraitV4      = 30
	portraitPhi     = 0.04
	portraitCurrent = 100

	portraitXCenter = -10 + 0.25
	portraitYCenter = 0.35 + 0.25
	portraitXHalf   = 85.0
	portraitYHalf   = 1.0

	portraitRefSpan = 1600.0
	portraitAspect  = 16.0 / 9.0

	portraitGrid       = 900
	portraitFieldCols  = 26
	portraitFieldRows  = 16
	portraitFieldSteps = 90
	portraitFieldPace  = 0.0022
	portraitNewton     = 40
	portraitSepSteps   = 900
	portraitSepNudge   = 0.004
	portraitCycleBurn  = 40000
	portraitCyclePts   = 2600
	portraitCycleStep  = 0.05
	portraitEscape     = 40
)

func portraitFlow(x, y float64) (float64, float64) {
	opening := 0.5 * (1 + math.Tanh((x-portraitV1)/portraitV2))
	settled := 0.5 * (1 + math.Tanh((x-portraitV3)/portraitV4))
	dx := (portraitCurrent -
		portraitGLeak*(math.Tanh(x*x)*x-portraitELeak) -
		portraitGCa*opening*(x-portraitECa) -
		portraitGK*math.Tanh(y*y)*y*(x-portraitEK)) / portraitCap
	dy := (portraitPhi * (settled - y)) / math.Cosh((x-portraitV3)/(2*portraitV4))
	return dx, dy
}

var (
	portraitXScale = portraitRefSpan / (2 * 65.0)
	portraitYScale = portraitRefSpan / portraitAspect / (2 * 0.4)
	portraitWidth  = 2 * portraitXHalf * portraitXScale
	portraitHeight = 2 * portraitYHalf * portraitYScale
)

func portraitPX(x float64) float64 {
	return (x - (portraitXCenter - portraitXHalf)) * portraitXScale
}

func portraitPY(y float64) float64 {
	return ((portraitYCenter + portraitYHalf) - y) * portraitYScale
}

func portraitJacobian(x, y float64) (a, b, c, d float64) {
	hx := 65.0 * 0.00001
	hy := 0.4 * 0.00001
	fx1, fy1 := portraitFlow(x+hx, y)
	fx0, fy0 := portraitFlow(x-hx, y)
	gx1, gy1 := portraitFlow(x, y+hy)
	gx0, gy0 := portraitFlow(x, y-hy)
	return (fx1 - fx0) / (2 * hx), (gx1 - gx0) / (2 * hy),
		(fy1 - fy0) / (2 * hx), (gy1 - gy0) / (2 * hy)
}

func portraitStep(p *[2]float64, h float64) {
	x, y := p[0], p[1]
	k1x, k1y := portraitFlow(x, y)
	k2x, k2y := portraitFlow(x+0.5*h*k1x, y+0.5*h*k1y)
	k3x, k3y := portraitFlow(x+0.5*h*k2x, y+0.5*h*k2y)
	k4x, k4y := portraitFlow(x+h*k3x, y+h*k3y)
	p[0] = x + h*(k1x+2*k2x+2*k3x+k4x)/6
	p[1] = y + h*(k1y+2*k2y+2*k3y+k4y)/6
}

func portraitStream(p *[2]float64, sign float64) bool {
	dx, dy := portraitFlow(p[0], p[1])
	vx := dx * portraitXScale
	vy := dy * portraitYScale
	speed := math.Hypot(vx, vy)
	if !(speed > 1e-9) {
		return false
	}
	gain := sign * portraitFieldPace * portraitRefSpan / speed
	p[0] += dx * gain
	p[1] += dy * gain
	return true
}

func portraitSlowY(x float64) float64 {
	return 0.5 * (1 + math.Tanh((x-portraitV3)/portraitV4))
}

func portraitFastRoots(x float64, out []float64) []float64 {
	out = out[:0]
	const scan = 400
	lo := portraitYCenter - portraitYHalf
	hi := portraitYCenter + portraitYHalf
	prevY := lo
	prevV, _ := portraitFlow(x, lo)
	for i := 1; i <= scan; i++ {
		y := lo + (hi-lo)*float64(i)/scan
		v, _ := portraitFlow(x, y)
		if prevV == 0 {
			out = append(out, prevY)
		} else if (prevV > 0) != (v > 0) {
			a, b, av := prevY, y, prevV
			for k := 0; k < 40; k++ {
				mid := (a + b) * 0.5
				mv, _ := portraitFlow(x, mid)
				if (av > 0) != (mv > 0) {
					b = mid
				} else {
					a, av = mid, mv
				}
			}
			out = append(out, (a+b)*0.5)
		}
		prevY, prevV = y, v
	}
	return out
}

type portraitBranch struct{ pts [][2]float64 }

func portraitFastNullcline() []portraitBranch {
	const cols = 1400
	lo := portraitXCenter - portraitXHalf
	hi := portraitXCenter + portraitXHalf
	var live []portraitBranch
	var done []portraitBranch
	roots := make([]float64, 0, 8)
	for i := 0; i <= cols; i++ {
		x := lo + (hi-lo)*float64(i)/cols
		roots = portraitFastRoots(x, roots)
		if len(roots) != len(live) {
			done = append(done, live...)
			live = make([]portraitBranch, len(roots))
		}
		for k, y := range roots {
			live[k].pts = append(live[k].pts, [2]float64{x, y})
		}
	}
	return append(done, live...)
}

func portraitSlowNullcline() portraitBranch {
	const cols = 700
	lo := portraitXCenter - portraitXHalf
	hi := portraitXCenter + portraitXHalf
	var b portraitBranch
	for i := 0; i <= cols; i++ {
		x := lo + (hi-lo)*float64(i)/cols
		b.pts = append(b.pts, [2]float64{x, portraitSlowY(x)})
	}
	return b
}

func portraitEquilibria() [][2]float64 {
	const scan = 4000
	lo := portraitXCenter - portraitXHalf
	hi := portraitXCenter + portraitXHalf
	at := func(x float64) float64 {
		v, _ := portraitFlow(x, portraitSlowY(x))
		return v
	}
	var found [][2]float64
	prevX := lo
	prevV := at(lo)
	for i := 1; i <= scan; i++ {
		x := lo + (hi-lo)*float64(i)/scan
		v := at(x)
		if (prevV > 0) != (v > 0) {
			a, b, av := prevX, x, prevV
			for k := 0; k < 60; k++ {
				mid := (a + b) * 0.5
				mv := at(mid)
				if (av > 0) != (mv > 0) {
					b = mid
				} else {
					a, av = mid, mv
				}
			}
			root := (a + b) * 0.5
			found = append(found, [2]float64{root, portraitSlowY(root)})
		}
		prevX, prevV = x, v
	}
	return found
}

func portraitFolds() [][2]float64 {
	const cols = 1400
	lo := portraitXCenter - portraitXHalf
	hi := portraitXCenter + portraitXHalf
	yLo := portraitYCenter - portraitYHalf
	yHi := portraitYCenter + portraitYHalf
	edge := (yHi - yLo) * 0.002

	var folds [][2]float64
	prev := make([]float64, 0, 8)
	cur := make([]float64, 0, 8)
	prev = portraitFastRoots(lo, prev)
	for i := 1; i <= cols; i++ {
		x := lo + (hi-lo)*float64(i)/cols
		cur = portraitFastRoots(x, cur)
		if len(cur) < len(prev) {
			for _, y := range prev {
				if y-yLo < edge || yHi-y < edge {
					continue
				}
				gone := true
				for _, k := range cur {
					if math.Abs(k-y) < (yHi-yLo)*0.05 {
						gone = false
					}
				}
				if gone {
					folds = append(folds, [2]float64{x, y})
				}
			}
		}
		prev = append(prev[:0], cur...)
	}
	return folds
}

func portraitTrace(p [2]float64, sign float64, steps int) []([2]float64) {
	pts := [][2]float64{p}
	cur := p
	lo := [2]float64{portraitXCenter - portraitXHalf, portraitYCenter - portraitYHalf}
	hi := [2]float64{portraitXCenter + portraitXHalf, portraitYCenter + portraitYHalf}
	for n := 0; n < steps; n++ {
		if !portraitStream(&cur, sign) {
			break
		}
		if math.IsNaN(cur[0]) || math.IsNaN(cur[1]) {
			break
		}
		if cur[0] < lo[0] || cur[0] > hi[0] || cur[1] < lo[1] || cur[1] > hi[1] {
			pts = append(pts, cur)
			break
		}
		pts = append(pts, cur)
	}
	return pts
}

func portraitSeparatrices(rest [][2]float64) [][]([2]float64) {
	var out [][]([2]float64)
	for _, e := range rest {
		a, b, c, d := portraitJacobian(e[0], e[1])
		det := a*d - b*c
		if det >= 0 {
			continue
		}
		rate := math.Sqrt(-det)
		nudge := portraitSepNudge * portraitXHalf
		for _, outward := range []float64{1, -1} {
			for _, direction := range []float64{1, -1} {
				lambda := direction * rate
				vx, vy := b, lambda-a
				if math.Abs(vx)+math.Abs(vy) < 1e-12 {
					vx, vy = lambda-d, c
				}
				px := vx * portraitXScale
				py := vy * portraitYScale
				norm := math.Hypot(px, py)
				if !(norm > 1e-12) {
					continue
				}
				start := [2]float64{
					e[0] + outward*nudge*px/norm,
					e[1] + outward*nudge*py/norm,
				}
				out = append(out, portraitTrace(start, direction, portraitSepSteps))
			}
		}
	}
	return out
}

func portraitCycle(rest [][2]float64) []([2]float64) {
	for _, e := range rest {
		a, b, c, d := portraitJacobian(e[0], e[1])
		if a*d-b*c <= 0 || a+d <= 0 {
			continue
		}
		p := [2]float64{e[0] + portraitXHalf*0.12, e[1]}
		for n := 0; n < portraitCycleBurn; n++ {
			portraitStep(&p, portraitCycleStep)
			if math.IsNaN(p[0]) || math.IsInf(p[0], 0) {
				return nil
			}
		}
		pts := [][2]float64{p}
		lowX, highX := math.Inf(1), math.Inf(-1)
		lowY, highY := math.Inf(1), math.Inf(-1)
		for n := 0; n < portraitCyclePts; n++ {
			portraitStep(&p, portraitCycleStep)
			if math.IsNaN(p[0]) || math.IsInf(p[0], 0) {
				break
			}
			lowX, highX = math.Min(lowX, p[0]), math.Max(highX, p[0])
			lowY, highY = math.Min(lowY, p[1]), math.Max(highY, p[1])
			pts = append(pts, p)
		}
		if (highX-lowX)*portraitXScale+(highY-lowY)*portraitYScale > 40 {
			return pts
		}
	}
	return nil
}

func portraitPath(runs [][]([2]float64)) string {
	var d strings.Builder
	for _, run := range runs {
		for i, p := range run {
			verb := "L"
			if i == 0 {
				verb = "M"
			}
			fmt.Fprintf(&d, "%s%.1f %.1f", verb, portraitPX(p[0]), portraitPY(p[1]))
		}
	}
	return d.String()
}

var portraitImage = renderPortrait()

func renderPortrait() string {
	fast := portraitFastNullcline()
	slow := portraitSlowNullcline()
	rest := portraitEquilibria()
	folds := portraitFolds()

	fastRuns := make([][]([2]float64), 0, len(fast))
	for _, b := range fast {
		if len(b.pts) > 1 {
			fastRuns = append(fastRuns, b.pts)
		}
	}

	var out strings.Builder
	fmt.Fprintf(&out, `<svg xmlns="http://www.w3.org/2000/svg" width="%.0f" height="%.0f" viewBox="0 0 %.0f %.0f" fill="none" stroke-linecap="round" stroke-linejoin="round">`,
		portraitWidth, portraitHeight, portraitWidth, portraitHeight)

	fmt.Fprintf(&out, `<path d="%s" stroke="rgba(0,0,0,0.18)" stroke-width="1" stroke-dasharray="5 6"/>`, portraitPath([][]([2]float64){slow.pts}))
	fmt.Fprintf(&out, `<path d="%s" stroke="rgba(0,0,0,0.3)" stroke-width="1.2" stroke-dasharray="3 4"/>`, portraitPath(fastRuns))

	if cycle := portraitCycle(rest); len(cycle) > 1 {
		fmt.Fprintf(&out, `<path d="%s" stroke="rgba(0,0,0,0.26)" stroke-width="1.3"/>`, portraitPath([][]([2]float64){cycle}))
	}
	if seps := portraitSeparatrices(rest); len(seps) > 0 {
		fmt.Fprintf(&out, `<path d="%s" stroke="rgba(0,0,0,0.28)" stroke-width="1.2"/>`, portraitPath(seps))
	}
	for _, f := range folds {
		fmt.Fprintf(&out, `<circle cx="%.1f" cy="%.1f" r="3" fill="rgba(0,0,0,0.42)"/>`, portraitPX(f[0]), portraitPY(f[1]))
	}
	for _, e := range rest {
		a, b, c, d := portraitJacobian(e[0], e[1])
		px, py := portraitPX(e[0]), portraitPY(e[1])
		if a*d-b*c > 0 && a+d < 0 {
			fmt.Fprintf(&out, `<circle cx="%.1f" cy="%.1f" r="3.4" fill="rgba(0,0,0,0.45)"/>`, px, py)
		} else {
			fmt.Fprintf(&out, `<circle cx="%.1f" cy="%.1f" r="3.4" stroke="rgba(0,0,0,0.45)" stroke-width="1.3"/>`, px, py)
		}
	}
	out.WriteString(`</svg>`)
	return out.String()
}

var portraitTag = fingerprintOf(portraitImage)

func portraitFrame() string {
	body, err := json.Marshal(map[string]any{
		"xCenter": portraitXCenter,
		"yCenter": portraitYCenter,
		"xHalf":   portraitXHalf,
		"yHalf":   portraitYHalf,
		"width":   portraitWidth,
		"height":  portraitHeight,
		"src":     "/portrait.svg?v=" + portraitTag,
	})
	if err != nil {
		return ""
	}
	return string(body)
}

func portraitSVG(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "image/svg+xml; charset=utf-8")
	w.Header().Set("ETag", `"`+portraitTag+`"`)
	if r.URL.Query().Get("v") != "" {
		w.Header().Set("Cache-Control", "public, max-age=31536000, s-maxage=31536000, immutable")
	} else {
		w.Header().Set("Cache-Control", "public, max-age=0, s-maxage=86400")
	}
	io.WriteString(w, portraitImage)
}

func fingerprintOf(body string) string {
	sum := sha256.Sum256([]byte(body))
	return hex.EncodeToString(sum[:])[:10]
}
