package middlewares

import (
	"net/http"
	"testing"
	"wanderlust/pkg/tokens"
)

func TestExtractTokensBothInvalid(t *testing.T) {
	cookies := []*http.Cookie{}

	accessToken, refreshToken := extractTokensFromCookies(cookies)

	if accessToken != "" {
		t.Errorf("Expected access token to be empty, got %s", accessToken)
	}

	if refreshToken != "" {
		t.Errorf("Expected refresh token to be empty, got %s", refreshToken)
	}
}

func TestExtractTokensBothValid(t *testing.T) {
	cookies := []*http.Cookie{
		{
			Name:  tokens.AccessTokenCookieName,
			Value: "access_token",
		},
		{
			Name:  tokens.RefreshTokenCookieName,
			Value: "refresh_token",
		},
	}

	accessToken, refreshToken := extractTokensFromCookies(cookies)

	if accessToken != cookies[0].Value {
		t.Errorf("Expected access token to be access_token, got %s", accessToken)
	}

	if refreshToken != cookies[1].Value {
		t.Errorf("Expected refresh token to be refresh_token, got %s", refreshToken)
	}
}

func TestExtractTokensAccessTokenValid(t *testing.T) {
	cookies := []*http.Cookie{
		{
			Name:  tokens.AccessTokenCookieName,
			Value: "access_token",
		},
	}

	accessToken, refreshToken := extractTokensFromCookies(cookies)

	if accessToken != cookies[0].Value {
		t.Errorf("Expected access token to be access_token, got %s", accessToken)
	}

	if refreshToken != "" {
		t.Errorf("Expected refresh token to be empty, got %s", refreshToken)
	}
}

func TestExtractTokensRefreshTokenValid(t *testing.T) {
	cookies := []*http.Cookie{
		{
			Name:  tokens.RefreshTokenCookieName,
			Value: "refresh_token",
		},
	}

	accessToken, refreshToken := extractTokensFromCookies(cookies)

	if accessToken != "" {
		t.Errorf("Expected access token to be empty, got %s", accessToken)
	}

	if refreshToken != cookies[0].Value {
		t.Errorf("Expected refresh token to be refresh_token, got %s", refreshToken)
	}
}
