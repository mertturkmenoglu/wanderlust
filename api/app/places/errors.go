package places

import "github.com/danielgtaylor/huma/v2"

var (
	ErrFailedToList                   = huma.Error500InternalServerError("Failed to list places")
	ErrNotFound                       = huma.Error404NotFound("Place not found")
	ErrFailedToCheckFavorite          = huma.Error500InternalServerError("Failed to check favorite status")
	ErrFailedToCheckBookmark          = huma.Error500InternalServerError("Failed to check bookmark status")
	ErrFailedToGet                    = huma.Error500InternalServerError("Failed to get place")
	ErrNotAuthorizedToUpdateAddress   = huma.Error403Forbidden("Not authorized to update place address")
	ErrFailedToUpdateAddress          = huma.Error500InternalServerError("Failed to update place address")
	ErrNotAuthorizedToUpdateInfo      = huma.Error403Forbidden("Not authorized to update place info")
	ErrFailedToUpdateInfo             = huma.Error500InternalServerError("Failed to update place info")
	ErrNotAuthorizedToUpdateAmenities = huma.Error403Forbidden("Not authorized to update place amenities")
	ErrFailedToUpdateAmenities        = huma.Error500InternalServerError("Failed to update place amenities")
	ErrNotAuthorizedToUpdateHours     = huma.Error403Forbidden("Not authorized to update place hours")
	ErrFailedToUpdateHours            = huma.Error500InternalServerError("Failed to update place hours")
)
