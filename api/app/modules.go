package app

import (
	"wanderlust/app/aggregator"
	"wanderlust/app/amenities"
	"wanderlust/app/auth"
	"wanderlust/app/bookmarks"
	"wanderlust/app/categories"
	"wanderlust/app/cities"
	"wanderlust/app/collections"
	"wanderlust/app/diaries"
	"wanderlust/app/export"
	"wanderlust/app/favorites"
	"wanderlust/app/health"
	"wanderlust/app/images"
	"wanderlust/app/lists"
	"wanderlust/app/pois"
	"wanderlust/app/reports"
	"wanderlust/app/reviews"
	"wanderlust/app/trips"
	"wanderlust/app/users"
	"wanderlust/pkg/core"
)

var Modules = []core.RegisterFunc{
	aggregator.Register,
	amenities.Register,
	auth.Register,
	bookmarks.Register,
	categories.Register,
	cities.Register,
	collections.Register,
	diaries.Register,
	export.Register,
	favorites.Register,
	health.Register,
	images.Register,
	lists.Register,
	pois.Register,
	reports.Register,
	reviews.Register,
	trips.Register,
	users.Register,
}
