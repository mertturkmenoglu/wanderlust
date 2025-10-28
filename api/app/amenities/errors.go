package amenities

import "github.com/danielgtaylor/huma/v2"

var (
	ErrNotFoundMany   = huma.Error404NotFound("No amenities found")
	ErrFailedToList   = huma.Error500InternalServerError("Failed to list amenities")
	ErrAlreadyExists  = huma.Error409Conflict("Amenity already exists")
	ErrCreateAmenity  = huma.Error500InternalServerError("Failed to create amenity")
	ErrNotFound       = huma.Error404NotFound("Amenity not found")
	ErrFailedToUpdate = huma.Error500InternalServerError("Failed to update amenity")
	ErrFailedToDelete = huma.Error500InternalServerError("Failed to delete amenity")
)
