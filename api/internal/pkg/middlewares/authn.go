package middlewares

import (
	"net/http"
	"strings"
	"time"
	"wanderlust/internal/pkg/tokens"

	"github.com/danielgtaylor/huma/v2"
)

func IsAuth(api huma.API) func(ctx huma.Context, next func(huma.Context)) {
	return func(ctx huma.Context, next func(huma.Context)) {
		token := strings.TrimPrefix(ctx.Header("Authorization"), "Bearer ")

		if len(token) == 0 {
			huma.WriteErr(api, ctx, http.StatusUnauthorized, "Unauthorized")
			return
		}

		claims, err := tokens.Decode(token)

		if err != nil {
			huma.WriteErr(api, ctx, http.StatusUnauthorized, "Unauthorized")
			return
		}

		if claims.ExpiresAt.Time.Before(time.Now()) {
			huma.WriteErr(api, ctx, http.StatusUnauthorized, "Token expired")
			return
		}

		if claims.Issuer != "wanderlust" {
			huma.WriteErr(api, ctx, http.StatusUnauthorized, "Invalid issuer")
			return
		}

		if claims.Subject != claims.Email {
			huma.WriteErr(api, ctx, http.StatusUnauthorized, "Invalid subject")
			return
		}

		ctx = huma.WithValue(ctx, "userId", claims.ID)
		ctx = huma.WithValue(ctx, "email", claims.Email)
		ctx = huma.WithValue(ctx, "username", claims.Username)
		ctx = huma.WithValue(ctx, "role", claims.Role)

		next(ctx)
	}
}

func WithAuth(api huma.API) func(ctx huma.Context, next func(huma.Context)) {
	return func(ctx huma.Context, next func(huma.Context)) {
		token := strings.TrimPrefix(ctx.Header("Authorization"), "Bearer ")

		if len(token) == 0 {
			next(setContextValuesEmpty(ctx))
			return
		}

		claims, err := tokens.Decode(token)

		if err != nil {
			next(setContextValuesEmpty(ctx))
			return
		}

		if claims.ExpiresAt.Time.Before(time.Now()) {
			next(setContextValuesEmpty(ctx))
			return
		}

		if claims.Issuer != "wanderlust" {
			next(setContextValuesEmpty(ctx))
			return
		}

		if claims.Subject != claims.Email {
			next(setContextValuesEmpty(ctx))
			return
		}

		ctx = huma.WithValue(ctx, "userId", claims.ID)
		ctx = huma.WithValue(ctx, "email", claims.Email)
		ctx = huma.WithValue(ctx, "username", claims.Username)
		ctx = huma.WithValue(ctx, "role", claims.Role)

		next(ctx)
	}
}

func setContextValuesEmpty(ctx huma.Context) huma.Context {
	ctx = huma.WithValue(ctx, "userId", "")
	ctx = huma.WithValue(ctx, "email", "")
	ctx = huma.WithValue(ctx, "username", "")
	ctx = huma.WithValue(ctx, "role", "")
	return ctx
}
