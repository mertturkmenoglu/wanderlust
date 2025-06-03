package tokens

import (
	"errors"
	"time"
	"wanderlust/pkg/cfg"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type UserInformation struct {
	ID       string
	Username string
	Role     string
}

var (
	ErrorExpired      = errors.New("token is expired")
	ErrorInvalidToken = errors.New("invalid token")
)

type AccessTokenData struct {
	UserID   string `json:"id"`
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

type RefreshTokenData struct {
	UserID   string `json:"id"`
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

type AuthTokens struct {
	AccessToken     string
	AccessTokenJTI  string
	RefreshToken    string
	RefreshTokenJTI string
}

// Returns access and refresh tokens or error
func CreateAuthTokens(payload UserInformation) (*AuthTokens, error) {
	now := time.Now()

	accessTokenData := AccessTokenData{
		UserID:   payload.ID,
		Username: payload.Username,
		Role:     payload.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(now.Add(AccessTokenExpiration)),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
			Issuer:    "wanderlust",
			Subject:   payload.ID,
			ID:        uuid.NewString(),
		},
	}

	refreshTokenData := RefreshTokenData{
		UserID:   payload.ID,
		Username: payload.Username,
		Role:     payload.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(now.Add(RefreshTokenExpiration)),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
			Issuer:    "wanderlust",
			Subject:   payload.ID,
			ID:        uuid.NewString(),
		},
	}

	accessToken, err := jwt.
		NewWithClaims(jwt.SigningMethodHS256, accessTokenData).
		SignedString([]byte(cfg.Env.AccessTokenSecret))

	if err != nil {
		return nil, err
	}

	refreshToken, err := jwt.
		NewWithClaims(jwt.SigningMethodHS256, refreshTokenData).
		SignedString([]byte(cfg.Env.RefreshTokenSecret))

	if err != nil {
		return nil, err
	}

	return &AuthTokens{
		AccessToken:     accessToken,
		AccessTokenJTI:  accessTokenData.ID,
		RefreshToken:    refreshToken,
		RefreshTokenJTI: refreshTokenData.ID,
	}, nil
}

func CheckTokens(accessToken string, refreshToken string) (*UserInformation, error) {
	accessClaims, err := DecodeAccessToken(accessToken)

	if err == nil {
		return &UserInformation{
			ID:       accessClaims.UserID,
			Username: accessClaims.Username,
			Role:     accessClaims.Role,
		}, nil
	}

	refreshClaims, err := DecodeRefreshToken(refreshToken)

	if err != nil {
		return nil, err
	}

	return &UserInformation{
		ID:       refreshClaims.UserID,
		Username: refreshClaims.Username,
		Role:     refreshClaims.Role,
	}, nil
}

func DecodeAccessToken(s string) (*AccessTokenData, error) {
	token, err := jwt.ParseWithClaims(s, &AccessTokenData{}, func(token *jwt.Token) (any, error) {
		return []byte(cfg.Env.AccessTokenSecret), nil
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

	if claims.Subject != claims.UserID {
		return nil, ErrorInvalidToken
	}

	return claims, nil
}

func DecodeRefreshToken(s string) (*RefreshTokenData, error) {
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

	if claims.Subject != claims.UserID {
		return nil, ErrorInvalidToken
	}

	return claims, nil
}
