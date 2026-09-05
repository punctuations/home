package main

import (
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"image"
	"image/color"
	"image/png"
	"math"
	"net/http"
	"sort"
	"time"
)

const (
	ogWidth  = 1200
	ogHeight = 630
	ogAngle  = 0.9
	ogTilt   = 0.22
	ogDot    = 2.6
)

var ogPaper = color.RGBA{0x1B, 0x1A, 0x17, 0xFF}
var ogInk = color.RGBA{0xF7, 0xF4, 0xEE, 0xFF}

var ogImage, ogTag = renderOpenGraph()

type plotted struct {
	x, y, depth float64
}

func renderOpenGraph() ([]byte, string) {
	canvas := image.NewRGBA(image.Rect(0, 0, ogWidth, ogHeight))
	for i := range canvas.Pix {
		canvas.Pix[i] = 0
	}
	fill(canvas, ogPaper)

	points := traceCurve(24000)
	sort.Slice(points, func(a, b int) bool { return points[a].depth < points[b].depth })

	for _, p := range points {
		splat(canvas, p.x, p.y, ogShade(p.depth))
	}

	square(canvas, ogWidth-96, ogHeight-96, 26, ogInk)

	var out bytes.Buffer
	if err := png.Encode(&out, canvas); err != nil {
		return nil, ""
	}

	sum := sha256.Sum256(out.Bytes())
	return out.Bytes(), hex.EncodeToString(sum[:])[:10]
}

func traceCurve(steps int) []plotted {
	sinYaw, cosYaw := math.Sincos(ogAngle)
	sinPitch, cosPitch := math.Sincos(ogTilt)
	tall := verticalExtent(ogTilt)

	scale := math.Min(ogWidth, ogHeight)*0.5 - 70
	midX, midY := float64(ogWidth)/2, float64(ogHeight)/2

	points := make([]plotted, 0, steps+1)
	for i := 0; i <= steps; i++ {
		px, py, pz := site.at(2 * math.Pi * float64(i) / float64(steps))

		flatX := px*cosYaw + pz*sinYaw
		flatZ := pz*cosYaw - px*sinYaw

		x := flatX / siteRX
		y := (py*cosPitch - flatZ*sinPitch) / tall
		depth := (py*sinPitch + flatZ*cosPitch) / siteRZ

		points = append(points, plotted{
			x:     midX + x*scale*1.7,
			y:     midY - y*scale,
			depth: (depth + 1) / 2,
		})
	}
	return points
}

func fill(canvas *image.RGBA, shade color.RGBA) {
	for y := canvas.Rect.Min.Y; y < canvas.Rect.Max.Y; y++ {
		for x := canvas.Rect.Min.X; x < canvas.Rect.Max.X; x++ {
			canvas.SetRGBA(x, y, shade)
		}
	}
}

func square(canvas *image.RGBA, left, top, size int, shade color.RGBA) {
	for y := top; y < top+size; y++ {
		for x := left; x < left+size; x++ {
			if image.Pt(x, y).In(canvas.Rect) {
				canvas.SetRGBA(x, y, shade)
			}
		}
	}
}

var ogFar = color.RGBA{0x3B, 0x3A, 0x34, 0xFF}
var ogNear = color.RGBA{0xED, 0xE7, 0xD9, 0xFF}

func ogShade(depth float64) color.RGBA {
	return mix(ogFar, ogNear, depth)
}

func mix(from, to color.RGBA, amount float64) color.RGBA {
	blend := func(a, b uint8) uint8 {
		return uint8(math.Round(float64(a) + (float64(b)-float64(a))*amount))
	}
	return color.RGBA{blend(from.R, to.R), blend(from.G, to.G), blend(from.B, to.B), 0xFF}
}

func splat(canvas *image.RGBA, cx, cy float64, shade color.RGBA) {
	left := int(math.Floor(cx - ogDot))
	right := int(math.Ceil(cx + ogDot))
	top := int(math.Floor(cy - ogDot))
	bottom := int(math.Ceil(cy + ogDot))

	for y := top; y <= bottom; y++ {
		for x := left; x <= right; x++ {
			if !image.Pt(x, y).In(canvas.Rect) {
				continue
			}

			away := math.Hypot(float64(x)+0.5-cx, float64(y)+0.5-cy)
			cover := (ogDot - away) / ogDot
			if cover <= 0 {
				continue
			}
			if cover > 1 {
				cover = 1
			}

			under := canvas.RGBAAt(x, y)
			canvas.SetRGBA(x, y, color.RGBA{
				over(under.R, shade.R, cover),
				over(under.G, shade.G, cover),
				over(under.B, shade.B, cover),
				0xFF,
			})
		}
	}
}

func over(under, top uint8, cover float64) uint8 {
	return uint8(float64(under)*(1-cover) + float64(top)*cover)
}

func openGraph(w http.ResponseWriter, r *http.Request) {
	if ogImage == nil {
		notFound(w, r)
		return
	}

	w.Header().Set("Content-Type", "image/png")
	w.Header().Set("ETag", `"`+ogTag+`"`)
	w.Header().Set("Cache-Control", "public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800")

	http.ServeContent(w, r, "og.png", time.Time{}, bytes.NewReader(ogImage))
}
