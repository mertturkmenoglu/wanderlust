package collections

import "github.com/danielgtaylor/huma/v2"

var (
	ErrNoCollectionFound = huma.Error404NotFound("No collection found")
	ErrFailedToList      = huma.Error500InternalServerError("Failed to list collections")
	ErrNotFound          = huma.Error404NotFound("Collection not found")
	ErrFailedToCount     = huma.Error500InternalServerError("Failed to count collections")
	ErrFailedToCreate    = huma.Error500InternalServerError("Failed to create collection")
)
