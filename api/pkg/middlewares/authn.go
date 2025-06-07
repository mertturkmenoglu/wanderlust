package middlewares

import (
	"net/http"
	"wanderlust/pkg/cfg"
	"wanderlust/pkg/tokens"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
	"go.opentelemetry.io/otel/attribute"
)

// Extracts access and refresh tokens from cookies
func extractFromCookie(cookies []*http.Cookie) (string, string) {
	var accessToken = ""
	var refreshToken = ""

	for _, cookie := range cookies {
		switch cookie.Name {
		case tokens.AccessTokenCookieName:
			accessToken = cookie.Value
		case tokens.RefreshTokenCookieName:
			refreshToken = cookie.Value
		}
	}

	return accessToken, refreshToken
}

// Is Authenticated Middleware
//
// This middleware checks if the user is authenticated or not.
// If the user is authenticated, it sets the userId, username, and role in the context.
// If not, returns an unauthorized error.
func IsAuth(api huma.API) func(ctx huma.Context, next func(huma.Context)) {
	return func(ctx huma.Context, next func(huma.Context)) {
		_, sp := tracing.NewSpan(ctx.Context())
		defer sp.End()

		accessToken, refreshToken := extractFromCookie(huma.ReadCookies(ctx))

		if accessToken == "" {
			sp.RecordError(huma.Error401Unauthorized("Unauthorized"))
			huma.WriteErr(api, ctx, http.StatusUnauthorized, "Unauthorized")
			return
		}

		userInformation, err := tokens.CheckTokens(accessToken, refreshToken)

		if err != nil {
			sp.RecordError(err)
			huma.WriteErr(api, ctx, http.StatusUnauthorized, "Unauthorized")
			return
		}

		ctx = huma.WithValue(ctx, "userId", userInformation.ID)
		ctx = huma.WithValue(ctx, "username", userInformation.Username)
		ctx = huma.WithValue(ctx, "role", userInformation.Role)

		if cfg.Env.Env == "dev" {
			sp.SetAttributes(attribute.String("userId", userInformation.ID))
			sp.SetAttributes(attribute.String("username", userInformation.Username))
			sp.SetAttributes(attribute.String("role", userInformation.Role))
		}

		next(ctx)
	}
}

// With Authenticated Middleware
//
// This middleware checks if the user is authenticated or not.
// If the user is authenticated, it sets the userId, username, and role in the context.
// If not, sets the userId, username, and role to empty strings in the context and
// continues with the next middleware.
func WithAuth(api huma.API) func(ctx huma.Context, next func(huma.Context)) {
	return func(ctx huma.Context, next func(huma.Context)) {
		_, sp := tracing.NewSpan(ctx.Context())
		defer sp.End()

		accessToken, refreshToken := extractFromCookie(huma.ReadCookies(ctx))

		if accessToken == "" {
			ctx = huma.WithValue(ctx, "userId", "")
			ctx = huma.WithValue(ctx, "username", "")
			ctx = huma.WithValue(ctx, "role", "")
			next(ctx)
			return
		}

		userInformation, err := tokens.CheckTokens(accessToken, refreshToken)

		if err != nil {
			ctx = huma.WithValue(ctx, "userId", "")
			ctx = huma.WithValue(ctx, "username", "")
			ctx = huma.WithValue(ctx, "role", "")
			next(ctx)
			return
		}

		ctx = huma.WithValue(ctx, "userId", userInformation.ID)
		ctx = huma.WithValue(ctx, "username", userInformation.Username)
		ctx = huma.WithValue(ctx, "role", userInformation.Role)

		if cfg.Env.Env == "dev" {
			sp.SetAttributes(attribute.String("userId", userInformation.ID))
			sp.SetAttributes(attribute.String("username", userInformation.Username))
			sp.SetAttributes(attribute.String("role", userInformation.Role))
		}

		next(ctx)
	}
}
