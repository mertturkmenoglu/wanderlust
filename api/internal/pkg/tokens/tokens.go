package tokens

import (
	"errors"
	"time"
	"wanderlust/internal/pkg/cfg"

	"github.com/golang-jwt/jwt/v5"
)

type Payload struct {
	ID       string
	Username string
	Email    string
	Role     string
}

var (
	ErrorExpired      = errors.New("token is expired")
	ErrorInvalidToken = errors.New("invalid token")
)

type Claims struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

// Produce a JWT from the payload that expires at the given time.
func Encode(payload Payload, expiresAt time.Time) (string, error) {
	secretKey := cfg.Get(cfg.JWT_SECRET)
	now := time.Now()

	// Create new claims from custom values and registered claims
	claims := Claims{
		ID:       payload.ID,
		Username: payload.Username,
		Role:     payload.Role,
		Email:    payload.Email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
			Issuer:    "wanderlust",
			Subject:   payload.Email,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString([]byte(secretKey))

	if err != nil {
		return "", err
	}

	return signed, nil
}

// Decodes given JWT formatted tokenString into Claims
func Decode(tokenString string) (*Claims, error) {
	secretKey := cfg.Get(cfg.JWT_SECRET)

	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*Claims)

	if !ok || !token.Valid {
		return nil, ErrorInvalidToken
	}

	if claims.ExpiresAt.Before(time.Now()) || claims.NotBefore.After(time.Now()) {
		return nil, ErrorExpired
	}

	return claims, nil
}
