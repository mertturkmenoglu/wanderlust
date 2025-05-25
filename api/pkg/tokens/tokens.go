package tokens

import (
	"errors"
	"time"
	"wanderlust/pkg/cfg"

	"github.com/golang-jwt/jwt/v5"
)

type UserInformation struct {
	ID       string
	Username string
	Role     string
}

var (
	ErrorExpired           = errors.New("token is expired")
	ErrorInvalidToken      = errors.New("invalid token")

)

type AccessTokenData struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

type RefreshTokenData struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

// Returns access and refresh tokens or error
func CreateAuthTokens(payload UserInformation) (string, string, error) {
	now := time.Now()

	accessTokenData := AccessTokenData{
		ID:       payload.ID,
		Username: payload.Username,
		Role:     payload.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(now.Add(AccessTokenExpiration)),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
			Issuer:    "wanderlust",
			Subject:   payload.ID,
		},
	}

	refreshTokenData := RefreshTokenData{
		ID:       payload.ID,
		Username: payload.Username,
		Role:     payload.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(now.Add(RefreshTokenExpiration)),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
			Issuer:    "wanderlust",
			Subject:   payload.ID,
		},
	}

	accessToken, err := jwt.
		NewWithClaims(jwt.SigningMethodHS256, accessTokenData).
		SignedString([]byte(cfg.Env.AcessTokenSecret))

	if err != nil {
		return "", "", err
	}

	refreshToken, err := jwt.
		NewWithClaims(jwt.SigningMethodHS256, refreshTokenData).
		SignedString([]byte(cfg.Env.RefreshTokenSecret))

	if err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}

func CheckTokens(accessToken string, refreshToken string) (*UserInformation, error) {
	accessClaims, err := decodeAccessToken(accessToken)

	if err == nil {
		return &UserInformation{
			ID:       accessClaims.ID,
			Username: accessClaims.Username,
			Role:     accessClaims.Role,
		}, nil
	}

	refreshClaims, err := decodeRefreshToken(refreshToken)

	if err != nil {
		return nil, err
	}

	return &UserInformation{
		ID:       refreshClaims.ID,
		Username: refreshClaims.Username,
		Role:     refreshClaims.Role,
	}, nil
}

func decodeAccessToken(s string) (*AccessTokenData, error) {
	token, err := jwt.ParseWithClaims(s, &AccessTokenData{}, func(token *jwt.Token) (any, error) {
		return []byte(cfg.Env.AcessTokenSecret), nil
	})

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*AccessTokenData)

	if !ok || !token.Valid {
		return nil, ErrorInvalidToken
	}

	if claims.ExpiresAt.Before(time.Now()) || claims.NotBefore.After(time.Now()) {
		return nil, ErrorExpired
	}

	if claims.Issuer != "wanderlust" {
		return nil, ErrorInvalidToken
	}

	if claims.Subject != claims.ID {
		return nil, ErrorInvalidToken
	}

	return claims, nil
}

func decodeRefreshToken(s string) (*RefreshTokenData, error) {
	token, err := jwt.ParseWithClaims(s, &RefreshTokenData{}, func(token *jwt.Token) (any, error) {
		return []byte(cfg.Env.RefreshTokenSecret), nil
	})

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*RefreshTokenData)

	if !ok || !token.Valid {
		return nil, ErrorInvalidToken
	}

	if claims.ExpiresAt.Before(time.Now()) || claims.NotBefore.After(time.Now()) {
		return nil, ErrorExpired
	}

	if claims.Issuer != "wanderlust" {
		return nil, ErrorInvalidToken
	}

	if claims.Subject != claims.ID {
		return nil, ErrorInvalidToken
	}

	return claims, nil
}
