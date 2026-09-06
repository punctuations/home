package main

import (
	"encoding/json"
	htmltemplate "html/template"
	"time"
)

type mark struct {
	Project
	Path string
}

func structuredData() htmltemplate.JS {
	profile := map[string]any{
		"@context":    "https://schema.org",
		"@type":       "Person",
		"name":        displayName,
		"url":         "https://" + canonicalHost + "/",
		"description": summary,
		"image":       "https://" + canonicalHost + "/og.png?v=" + ogTag,
		"sameAs":      []string{shortlinks["/github"], shortlinks["/twitter"]},
		"homeLocation": map[string]string{
			"@type": "Place",
			"name":  location,
		},
		"affiliation": map[string]string{
			"@type": "CollegeOrUniversity",
			"name":  "University of British Columbia",
		},
	}

	body, err := json.Marshal(profile)
	if err != nil {
		return ""
	}
	return htmltemplate.JS(body)
}

type view struct {
	Name         string
	Location     string
	LocationURL  string
	LocalTime    string
	Timezone     string
	Description  string
	ThemeColor   string
	CanonicalURL string
	OpenGraphURL string
	Structured   htmltemplate.JS
	StudyURL     string
	Email        string
	DiscordID    string
	Year         int
	Curve        string
	CurveData    string
	CurveWidth   int
	CurveHeight  int
	Github       githubPreview
	Presence     presencePreview
	Projects     []mark
	Elsewhere    []mark
	Home         bool
}

func (v view) settled() bool {
	return v.Presence.Username != "" && v.Github.Username != ""
}
func page() view {
	marks := make([]mark, len(projects))
	for i, p := range projects {
		marks[i] = mark{Project: p, Path: Path(p.A, p.B, p.C, p.Phase, restAngle)}
	}

	links := make([]mark, len(elsewhere))
	for i, p := range elsewhere {
		links[i] = mark{Project: p, Path: Path(p.A, p.B, p.C, p.Phase, restAngle)}
	}

	return view{
		Name:         displayName,
		Location:     location,
		LocalTime:    localTime(),
		Timezone:     timezone,
		Description:  summary,
		ThemeColor:   themeColor,
		CanonicalURL: "https://" + canonicalHost + "/",
		OpenGraphURL: "https://" + canonicalHost + "/og.png?v=" + ogTag,
		Structured:   structuredData(),
		StudyURL:     studyURL,
		Email:        contactEmail,
		DiscordID:    discordID,
		Year:         time.Now().In(zone()).Year(),
		Curve:        ASCII(asciiWidth, asciiHeight, backgroundAngle, 0),
		CurveData:    curveSettings(),
		CurveWidth:   asciiWidth,
		CurveHeight:  asciiHeight,
		Github:       githubMemo.get(),
		Presence:     presenceMemo.get(),
		Projects:     marks,
		Elsewhere:    links,
	}
}
