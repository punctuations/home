package main

import (
	"fmt"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"net/http"

	_ "golang.org/x/image/webp"
)

func fac(url string) (string, error) {
	response, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer response.Body.Close()

	if response.StatusCode < http.StatusOK || response.StatusCode >= http.StatusMultipleChoices {
		return "", fmt.Errorf("fetch image: %s", response.Status)
	}

	imageData, _, err := image.Decode(response.Body)
	if err != nil {
		return "", err
	}

	bounds := imageData.Bounds()
	bestHue, bestSaturation, bestValue := 0.0, 0.0, 0.0
	redTotal, greenTotal, blueTotal, pixels := 0, 0, 0, 0

	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			r, g, b, _ := imageData.At(x, y).RGBA()
			red, green, blue := float64(r)/65535, float64(g)/65535, float64(b)/65535
			redTotal += int(red * 255)
			greenTotal += int(green * 255)
			blueTotal += int(blue * 255)
			pixels++

			maxValue := max(red, green, blue)
			minValue := min(red, green, blue)
			delta := maxValue - minValue
			saturation := 0.0
			if maxValue != 0 {
				saturation = delta / maxValue
			}
			if maxValue < 0.45 || maxValue > 0.92 || saturation <= bestSaturation {
				continue
			}

			hue := 0.0
			switch maxValue {
			case red:
				hue = (green - blue) / delta
				if hue < 0 {
					hue += 6
				}
			case green:
				hue = (blue-red)/delta + 2
			default:
				hue = (red-green)/delta + 4
			}

			bestHue, bestSaturation, bestValue = hue*60, saturation, maxValue
		}
	}

	if pixels == 0 {
		return "", fmt.Errorf("image has no pixels")
	}
	if bestSaturation == 0 {
		return fmt.Sprintf("rgb(%d, %d, %d)", redTotal/pixels, greenTotal/pixels, blueTotal/pixels), nil
	}

	red := facChannel(5, bestHue, bestSaturation, bestValue)
	green := facChannel(3, bestHue, bestSaturation, bestValue)
	blue := facChannel(1, bestHue, bestSaturation, bestValue)
	return fmt.Sprintf("rgb(%d, %d, %d)", red, green, blue), nil
}

func facChannel(channel, hue, saturation, value float64) int {
	k := (channel + hue/60) - float64(int((channel+hue/60)/6)*6)
	return int((value - value*saturation*max(0.0, min(k, 4-k, 1.0))) * 255)
}
