package main

import (
	"time"
	_ "time/tzdata"
)

const (
	discordID       = "291050399509774340"
	contactEmail    = "contact@thew.sh"
	displayName     = "Matthew"
	location        = "Vancouver, BC"
	studyURL        = "/~matthew"
	timezone        = "America/Vancouver"
	canonicalHost   = "thew.sh"
	summary         = "Algorithms, optimization, and compression"
	themeColor      = "#1B1A17"
	asciiWidth      = 114
	asciiHeight     = 48
	restAngle       = 0.6
	backgroundAngle = 0.30
)

func zone() *time.Location {
	loc, err := time.LoadLocation(timezone)
	if err != nil {
		return time.UTC
	}
	return loc
}
func localTime() string {
	return time.Now().In(zone()).Format("3:04pm")
}
