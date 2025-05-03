package bootstrap

import (
	"wanderlust/internal/app/aggregator"
	"wanderlust/internal/app/amenities"
	"wanderlust/internal/app/auth"
	"wanderlust/internal/app/bookmarks"
	"wanderlust/internal/app/categories"
	"wanderlust/internal/app/cities"
	"wanderlust/internal/app/favorites"
	"wanderlust/internal/app/health"
	"wanderlust/internal/app/pois"

	"github.com/danielgtaylor/huma/v2"
)

func RegisterRoutes(api *huma.API) {
	grp := huma.NewGroup(*api, API_PREFIX)
	app := NewApplication()

	aggregator.Register(grp, app)
	amenities.Register(grp, app)
	auth.Register(grp, app)
	bookmarks.Register(grp, app)
	categories.Register(grp, app)
	cities.Register(grp, app)
	favorites.Register(grp, app)
	health.Register(grp)
	pois.Register(grp, app)
}
