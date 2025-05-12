package bootstrap

import (
	"wanderlust/app/aggregator"
	"wanderlust/app/amenities"
	"wanderlust/app/auth"
	"wanderlust/app/bookmarks"
	"wanderlust/app/categories"
	"wanderlust/app/cities"
	"wanderlust/app/collections"
	"wanderlust/app/diary"
	"wanderlust/app/favorites"
	"wanderlust/app/health"
	"wanderlust/app/images"
	"wanderlust/app/lists"
	"wanderlust/app/pois"
	"wanderlust/app/reviews"
	"wanderlust/app/trips"
	"wanderlust/app/users"
	"wanderlust/pkg/utils"

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
	trips.Register(grp, app)
	users.Register(grp, app)
}
