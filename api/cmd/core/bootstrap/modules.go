package bootstrap

import (
	"wanderlust/internal/app/aggregator"
	"wanderlust/internal/app/amenities"
	"wanderlust/internal/app/auth"
	"wanderlust/internal/app/bookmarks"
	"wanderlust/internal/app/categories"
	"wanderlust/internal/app/cities"
	"wanderlust/internal/app/collections"
	"wanderlust/internal/app/diary"
	"wanderlust/internal/app/favorites"
	"wanderlust/internal/app/health"
	"wanderlust/internal/app/images"
	"wanderlust/internal/app/lists"
	"wanderlust/internal/app/pois"
	"wanderlust/internal/app/reviews"
	"wanderlust/internal/app/users"
	"wanderlust/internal/pkg/utils"

	"github.com/danielgtaylor/huma/v2"
	"go.opentelemetry.io/otel/attribute"
)

func RegisterRoutes(api *huma.API) {
	grp := huma.NewGroup(*api, API_PREFIX)
	app := NewApplication()

	grp.UseMiddleware(func(ctx huma.Context, next func(huma.Context)) {
		oid := ctx.Operation().OperationID
		if oid == "" {
			oid = ctx.Operation().Summary
		}
		sp := utils.NewSpan(ctx.Context(), oid)
		defer sp.End()

		sp.SetAttributes(attribute.String("operation-id", oid))
		next(ctx)
	})

	aggregator.Register(grp, app)
	amenities.Register(grp, app)
	auth.Register(grp, app)
	bookmarks.Register(grp, app)
	categories.Register(grp, app)
	cities.Register(grp, app)
	collections.Register(grp, app)
	diary.Register(grp, app)
	favorites.Register(grp, app)
	health.Register(grp)
	images.Register(grp, app)
	lists.Register(grp, app)
	pois.Register(grp, app)
	reviews.Register(grp, app)
	users.Register(grp, app)
}
