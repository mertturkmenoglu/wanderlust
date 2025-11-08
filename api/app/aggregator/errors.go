package aggregator

import "github.com/danielgtaylor/huma/v2"

var (
	ErrListFavorites = huma.Error500InternalServerError("Failed to list favorite places")
	ErrListFeatured  = huma.Error500InternalServerError("Failed to list featured places")
	ErrListNew       = huma.Error500InternalServerError("Failed to list new places")
	ErrListPopular   = huma.Error500InternalServerError("Failed to list popular places")
	ErrAggregation   = huma.Error500InternalServerError("Failed to get aggregation")
)
