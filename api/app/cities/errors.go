package cities

import (
	"github.com/cockroachdb/errors"
	"github.com/danielgtaylor/huma/v2"
)

var (
	ErrorDomain             = errors.NamedDomain("cities")
	ErrNoCityFound          = huma.Error404NotFound("No city found")
	ErrFailedToList         = huma.Error500InternalServerError("Failed to list cities")
	ErrNoFeaturedCityFound  = huma.Error404NotFound("No featured city found")
	ErrFailedToListFeatured = huma.Error500InternalServerError("Failed to list featured cities")
	ErrNotFound             = huma.Error404NotFound("City not found")
	ErrAlreadyExists        = huma.Error409Conflict("City already exists")
	ErrFailedToCreate       = huma.Error500InternalServerError("Failed to create city")
	ErrFailedToDelete       = huma.Error500InternalServerError("Failed to delete city")
	ErrFailedToUpdate       = huma.Error500InternalServerError("Failed to update city")
)
