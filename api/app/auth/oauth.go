package auth

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"wanderlust/pkg/cfg"
	"wanderlust/pkg/random"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/facebook"
	"golang.org/x/oauth2/google"
)

type getOAuthTokenParams struct {
	provider    string
	state       string
	cookieState string
	code        string
}

type oauthUser struct {
	provider string
	id       string
	email    string
	name     string
	picture  string
}

type googleUser struct {
	Id            string `json:"id"`
	Email         string `json:"email"`
	VerifiedEmail bool   `json:"verified_email"`
	Name          string `json:"name"`
	GivenName     string `json:"given_name"`
	FamilyName    string `json:"family_name"`
	Picture       string `json:"picture"`
}

type fbUser struct {
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

func getOAuthConfig(provider string) *oauth2.Config {
	switch provider {
	case "google":
		return getGoogleOAuth2Config()
	case "facebook":
		return getFbOAuth2Config()
	default:
		panic("Invalid provider")
	}
}

func getGoogleOAuth2Config() *oauth2.Config {
	return &oauth2.Config{
		ClientID:     cfg.Env.GoogleClientID,
		ClientSecret: cfg.Env.GoogleClientSecret,
		RedirectURL:  cfg.Env.GoogleCallback,
		Scopes:       []string{"profile", "email"},
		Endpoint:     google.Endpoint,
	}
}

func getFbOAuth2Config() *oauth2.Config {
	return &oauth2.Config{
		ClientID:     cfg.Env.FacebookClientID,
		ClientSecret: cfg.Env.FacebookClientSecret,
		RedirectURL:  cfg.Env.FacebookCallback,
		Scopes:       []string{"public_profile", "email"},
		Endpoint:     facebook.Endpoint,
	}
}

func getOAuthToken(ctx context.Context, params getOAuthTokenParams) (*oauth2.Token, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	cfg := getOAuthConfig(params.provider)

	if params.state != params.cookieState {
		err := huma.Error400BadRequest("State parameter mismatch")
		sp.RecordError(err)
		return nil, err
	}

	// Exchange the code for a token
	token, err := cfg.Exchange(ctx, params.code)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to exchange code for token")
	}

	return token, nil
}

func fetchUserInfo(ctx context.Context, provider string, token *oauth2.Token) (*oauthUser, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	cfg := getOAuthConfig(provider)
	client := cfg.Client(ctx, token)

	var endpoint = ""

	switch provider {
	case "google":
		endpoint = GOOGLE_USER_ENDPOINT
	case "facebook":
		endpoint = FB_USER_ENDPOINT
	default:
		panic("Invalid provider")
	}

	res, err := client.Get(endpoint)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to fetch user info")
	}

	defer res.Body.Close()

	userInfo := oauthUser{}

	switch provider {
	case "google":
		googleUser := googleUser{}
		if err := json.NewDecoder(res.Body).Decode(&googleUser); err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to parse user info")
		}
		mapGoogleUserToOAuthUser(&userInfo, &googleUser)
	case "facebook":
		fbUser := fbUser{}
		if err := json.NewDecoder(res.Body).Decode(&fbUser); err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to parse user info")
		}
		mapFbUserToOAuthUser(&userInfo, &fbUser)
	default:
		panic("Invalid provider")
	}

	return &userInfo, nil
}

func mapGoogleUserToOAuthUser(oauthUser *oauthUser, googleUser *googleUser) {
	oauthUser.provider = "google"
	oauthUser.id = googleUser.Id
	oauthUser.email = googleUser.Email
	oauthUser.name = googleUser.Name
	oauthUser.picture = googleUser.Picture
}

func mapFbUserToOAuthUser(oauthUser *oauthUser, fbUser *fbUser) {
	oauthUser.provider = "facebook"
	oauthUser.id = fbUser.Id
	oauthUser.email = fbUser.Email
	oauthUser.name = fbUser.Name
	oauthUser.picture = fbUser.Picture.Data.Url
}

// state is used for additional OAuth2 security.
// It generates a random string of 16 bytes.
// It then encodes it to base64 URL encoding.
func generateStateString() (string, error) {
	bytes, err := random.Bytes(16)

	if err != nil {
		return "", err
	}

	return base64.URLEncoding.EncodeToString(bytes), nil
}

func getOAuthStateAndRedirectUrl(provider string) (string, string, error) {
	cfg := getOAuthConfig(provider)
	state, err := generateStateString()

	if err != nil {
		return "", "", err
	}

	url := cfg.AuthCodeURL(state, oauth2.ApprovalForce)
	return state, url, nil
}
