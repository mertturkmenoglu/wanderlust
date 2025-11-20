package oauth

import (
	"encoding/json"
	"io"
	"wanderlust/pkg/cfg"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/facebook"
)

type FacebookProvider struct {
	userInfo *struct {
		Email   string `json:"email"`
		Id      string `json:"id"`
		Name    string `json:"name"`
		Picture struct {
			Data struct {
				Height        int    `json:"height"`
				Is_silhouette bool   `json:"is_silhouette"`
				Url           string `json:"url"`
				Width         int    `json:"width"`
			} `json:"data"`
		} `json:"picture"`
	}
}

var _ Provider = (*FacebookProvider)(nil)

func (fp *FacebookProvider) GetConfig() *oauth2.Config {
	return &oauth2.Config{
		ClientID:     cfg.Env.FacebookClientID,
		ClientSecret: cfg.Env.FacebookClientSecret,
		RedirectURL:  cfg.Env.FacebookCallback,
		Scopes:       []string{"public_profile", "email"},
		Endpoint:     facebook.Endpoint,
	}
}

func (fp *FacebookProvider) GetUserInfoEndpoint() string {
	return "https://graph.facebook.com/me?fields=id,name,email,picture.width(800).height(800)"
}

func (fp *FacebookProvider) ToUser() *User {
	return &User{
		Provider: "facebook",
		ID:       fp.userInfo.Id,
		Email:    fp.userInfo.Email,
		Name:     fp.userInfo.Name,
		Picture:  fp.userInfo.Picture.Data.Url,
	}
}

func (fp *FacebookProvider) ParseUserInfo(data io.ReadCloser) error {
	return json.NewDecoder(data).Decode(&fp.userInfo)
}
