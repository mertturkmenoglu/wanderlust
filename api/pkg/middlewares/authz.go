package middlewares

import (
	"net/http"
	"wanderlust/pkg/authz"

	"github.com/danielgtaylor/huma/v2"
)

func Authz(api huma.API, key authz.AuthzAct) func(ctx huma.Context, next func(huma.Context)) {
	return func(ctx huma.Context, next func(huma.Context)) {
		az := authz.New(getDb())
		fn := authz.Fns[key]

		if fn == nil {
			_ = huma.WriteErr(api, ctx, http.StatusInternalServerError, "an error occurred")
			return
		}

		isAuthorized, err := fn(az, ctx)

		if err != nil {
			v, ok := err.(huma.StatusError)

			if ok {
				_ = huma.WriteErr(api, ctx, v.GetStatus(), v.Error())
				return
			}

			_ = huma.WriteErr(api, ctx, http.StatusInternalServerError, "an error occurred")
			return
		}

		if !isAuthorized {
			_ = huma.WriteErr(api, ctx, http.StatusForbidden, "unauthorized to perform this action")
			return
		}

		next(ctx)
	}
}
