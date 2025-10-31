package aggregator

import "github.com/danielgtaylor/huma/v2"

var (
	ErrListFavorites = huma.Error500InternalServerError("Failed to list favorite POIs")
	ErrListFeatured  = huma.Error500InternalServerError("Failed to list featured POIs")
	ErrListNew       = huma.Error500InternalServerError("Failed to list new POIs")
	ErrListPopular   = huma.Error500InternalServerError("Failed to list popular POIs")
	ErrAggregation   = huma.Error500InternalServerError("Failed to get aggregation")
)
