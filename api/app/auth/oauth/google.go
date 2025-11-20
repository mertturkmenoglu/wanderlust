package oauth

import (
	"encoding/json"
	"io"
	"wanderlust/pkg/cfg"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

type GoogleProvider struct {
	userInfo *struct {
		Id            string `json:"id"`
		Email         string `json:"email"`
		VerifiedEmail bool   `json:"verified_email"`
		Name          string `json:"name"`
		GivenName     string `json:"given_name"`
		FamilyName    string `json:"family_name"`
		Picture       string `json:"picture"`
	}
}

var _ Provider = (*GoogleProvider)(nil)

func (gp *GoogleProvider) GetConfig() *oauth2.Config {
	return &oauth2.Config{
		ClientID:     cfg.Env.GoogleClientID,
		ClientSecret: cfg.Env.GoogleClientSecret,
		RedirectURL:  cfg.Env.GoogleCallback,
		Scopes:       []string{"profile", "email"},
		Endpoint:     google.Endpoint,
	}
}

func (gp *GoogleProvider) GetUserInfoEndpoint() string {
	return "https://www.googleapis.com/oauth2/v2/userinfo"
}

func (gp *GoogleProvider) ToUser() *User {
	return &User{
		Provider: "google",
		ID:       gp.userInfo.Id,
		Email:    gp.userInfo.Email,
		Name:     gp.userInfo.Name,
		Picture:  gp.userInfo.Picture,
	}
}

func (gp *GoogleProvider) ParseUserInfo(data io.ReadCloser) error {
	return json.NewDecoder(data).Decode(&gp.userInfo)
}
