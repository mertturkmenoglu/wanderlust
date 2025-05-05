package middlewares

import (
	"net/http"
	"wanderlust/internal/pkg/authz"

	"github.com/danielgtaylor/huma/v2"
)

func Authz(api huma.API, key authz.AuthzAct) func(ctx huma.Context, next func(huma.Context)) {
	return func(ctx huma.Context, next func(huma.Context)) {
		az := authz.New(getDb())
		fn := authz.Fns[key]

		if fn == nil {
			huma.WriteErr(api, ctx, http.StatusInternalServerError, "an error occurred")
			return
		}

		isAuthorized, err := fn(az, ctx)

		if err != nil {
			huma.WriteErr(api, ctx, http.StatusInternalServerError, "an error occurred")
			return
		}

		if !isAuthorized {
			huma.WriteErr(api, ctx, http.StatusForbidden, "unauthorized to perform this action")
			return
		}

		next(ctx)
	}
}
