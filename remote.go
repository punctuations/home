package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"
)

type presencePreview struct {
	Status             string
	Listening          string
	Username           string
	DisplayName        string
	AvatarURL          string
	BannerURL          string
	Accent             string
	ListeningToSpotify bool
	SpotifySong        string
	SpotifyArtist      string
	SpotifyAlbumArtURL string
}

type presenceResponse struct {
	Data struct {
		DiscordStatus string `json:"discord_status"`
		DiscordUser   struct {
			ID         string `json:"id"`
			Username   string `json:"username"`
			GlobalName string `json:"global_name"`
			Avatar     string `json:"avatar"`
			Banner     string `json:"banner"`
		} `json:"discord_user"`
		Activities []struct {
			Type  int    `json:"type"`
			State string `json:"state"`
		} `json:"activities"`
		ListeningToSpotify bool `json:"listening_to_spotify"`
		Spotify            *struct {
			Song        string `json:"song"`
			Artist      string `json:"artist"`
			AlbumArtURL string `json:"album_art_url"`
		} `json:"spotify"`
	} `json:"data"`
}

type githubPreview struct {
	DisplayName   string
	Username      string
	Bio           string
	AvatarURL     string
	Contributions []int
}

type githubResponse struct {
	Data struct {
		User struct {
			Name                    string `json:"name"`
			Login                   string `json:"login"`
			Bio                     string `json:"bio"`
			AvatarURL               string `json:"avatarUrl"`
			ContributionsCollection struct {
				ContributionCalendar struct {
					Weeks []struct {
						ContributionDays []struct {
							ContributionCount int `json:"contributionCount"`
						} `json:"contributionDays"`
					} `json:"weeks"`
				} `json:"contributionCalendar"`
			} `json:"contributionsCollection"`
		} `json:"user"`
	} `json:"data"`
}

func fetchGithubPreview() githubPreview {
	value := githubPreview{}
	payload := map[string]string{"query": `{ user(login: "aamtt") { name login bio avatarUrl contributionsCollection { contributionCalendar { weeks { contributionDays { contributionCount } } } } } }`}
	body, err := json.Marshal(payload)
	if err == nil {
		request, requestErr := http.NewRequest(http.MethodPost, "https://api.github.com/graphql", bytes.NewReader(body))
		if requestErr == nil {
			request.Header.Set("Content-Type", "application/json")
			if token := os.Getenv("GITHUB_TOKEN"); token != "" {
				request.Header.Set("Authorization", "Bearer "+token)
			}
			response, responseErr := (&http.Client{Timeout: 5 * time.Second}).Do(request)
			if responseErr == nil {
				defer response.Body.Close()
				if response.StatusCode == http.StatusOK {
					var result githubResponse
					if json.NewDecoder(response.Body).Decode(&result) == nil && result.Data.User.Login != "" {
						value.DisplayName = result.Data.User.Name
						value.Username = result.Data.User.Login
						value.Bio = result.Data.User.Bio
						if value.DisplayName == "" {
							value.DisplayName = value.Username
						}
						if result.Data.User.AvatarURL != "" {
							value.AvatarURL = result.Data.User.AvatarURL
						}
						for _, week := range result.Data.User.ContributionsCollection.ContributionCalendar.Weeks {
							for _, day := range week.ContributionDays {
								value.Contributions = append(value.Contributions, day.ContributionCount)
							}
						}
					}
				}
			}
		}
	}

	return value
}

func fetchPresencePreview() presencePreview {
	value := presencePreview{}
	request, err := http.NewRequest(http.MethodGet, "https://api.lanyard.rest/v1/users/"+discordID, nil)
	if err == nil {
		response, responseErr := (&http.Client{Timeout: 5 * time.Second}).Do(request)
		if responseErr == nil {
			defer response.Body.Close()
			if response.StatusCode == http.StatusOK {
				var result presenceResponse
				if json.NewDecoder(response.Body).Decode(&result) == nil {
					value.Status = result.Data.DiscordStatus
					value.ListeningToSpotify = result.Data.ListeningToSpotify
					if result.Data.Spotify != nil {
						value.SpotifySong = result.Data.Spotify.Song
						value.SpotifyArtist = result.Data.Spotify.Artist
						value.SpotifyAlbumArtURL = result.Data.Spotify.AlbumArtURL
					}
					user := result.Data.DiscordUser
					if user.Username != "" {
						value.Username = user.Username
					}
					if user.GlobalName != "" {
						value.DisplayName = user.GlobalName
					}
					if user.ID != "" && user.Avatar != "" {
						value.AvatarURL = fmt.Sprintf("https://cdn.discordapp.com/avatars/%s/%s.webp?size=128", user.ID, user.Avatar)
					}
					if user.ID != "" && user.Banner != "" {
						value.BannerURL = fmt.Sprintf("https://cdn.discordapp.com/banners/%s/%s.webp?size=300", user.ID, user.Banner)
					}
					for _, activity := range result.Data.Activities {
						if activity.Type == 2 {
							value.Listening = activity.State
							break
						}
					}
					if value.BannerURL == "" && value.AvatarURL != "" {
						if accent, accentErr := fac(value.AvatarURL); accentErr == nil {
							value.Accent = accent
						}
					}
				}
			}
		}
	}

	return value
}
