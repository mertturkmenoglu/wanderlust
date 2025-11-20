package oauth

import "github.com/danielgtaylor/huma/v2"

var (
	ErrInvalidState  = huma.Error400BadRequest("State parameter mismatch")
	ErrTokenExchange = huma.Error500InternalServerError("Failed to exchange code for token")
	ErrFetchUserInfo = huma.Error500InternalServerError("Failed to fetch user info")
)
