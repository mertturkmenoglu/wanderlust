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
	"wanderlust/app/reports"
	"wanderlust/app/reviews"
	"wanderlust/app/trips"
	"wanderlust/app/users"
	"wanderlust/pkg/middlewares"

	"github.com/danielgtaylor/huma/v2"
)

func (w *Wanderlust) Routing() {
	grp := huma.NewGroup(*w.api, API_PREFIX)

	grp.UseMiddleware(middlewares.HumaOperationID())

	aggregator.Register(grp, w.app)
	amenities.Register(grp, w.app)
	auth.Register(grp, w.app)
	bookmarks.Register(grp, w.app)
	categories.Register(grp, w.app)
	cities.Register(grp, w.app)
	collections.Register(grp, w.app)
	diary.Register(grp, w.app)
	favorites.Register(grp, w.app)
	health.Register(grp, w.app)
	images.Register(grp, w.app)
	lists.Register(grp, w.app)
	pois.Register(grp, w.app)
	reports.Register(grp, w.app)
	reviews.Register(grp, w.app)
	trips.Register(grp, w.app)
	users.Register(grp, w.app)
}
