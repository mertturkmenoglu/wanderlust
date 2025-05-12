package middlewares

import "github.com/danielgtaylor/huma/v2"

func WithHumaContext(api huma.API) func(ctx huma.Context, next func(huma.Context)) {
	return func(ctx huma.Context, next func(huma.Context)) {
		ctx = huma.WithValue(ctx, "humaContext", ctx)
		next(ctx)
	}
}
