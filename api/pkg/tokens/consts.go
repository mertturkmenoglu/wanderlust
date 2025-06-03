package tokens

import "time"

const (
	AccessTokenCookieName  = "access_token"
	RefreshTokenCookieName = "refresh_token"
	AccessTokenExpiration  = 15 * time.Minute
	RefreshTokenExpiration = 7 * 24 * time.Hour
	AccessTokenMaxAge      = 60 * 15
	RefreshTokenMaxAge     = 60 * 60 * 24 * 7
)
