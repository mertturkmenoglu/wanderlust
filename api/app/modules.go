package app

import (
	"wanderlust/app/aggregator"
	"wanderlust/app/assets"
	"wanderlust/app/auth"
	"wanderlust/app/bookmarks"
	"wanderlust/app/categories"
	"wanderlust/app/cities"
	"wanderlust/app/collections"
	"wanderlust/app/favorites"
	"wanderlust/app/health"
	"wanderlust/app/lists"
	"wanderlust/app/places"
	"wanderlust/app/reports"
	"wanderlust/app/reviews"
	"wanderlust/app/trips"
	"wanderlust/app/users"
	"wanderlust/pkg/core"
)

var Modules = []core.RegisterFunc{
	aggregator.Register,
	assets.Register,
	auth.Register,
	bookmarks.Register,
	categories.Register,
	cities.Register,
	collections.Register,
	favorites.Register,
	health.Register,
	lists.Register,
	places.Register,
	reports.Register,
	reviews.Register,
	trips.Register,
	users.Register,
}
