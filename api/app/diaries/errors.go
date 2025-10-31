package diaries

import "github.com/danielgtaylor/huma/v2"

var (
	ErrFailedToList                   = huma.Error500InternalServerError("Failed to list diaries")
	ErrNotFound                       = huma.Error404NotFound("Diary not found")
	ErrFailedToCreate                 = huma.Error500InternalServerError("Failed to create diary")
	ErrNotAuthorized                  = huma.Error403Forbidden("Not authorized to access this diary")
	ErrInvalidDateFormatParameter     = huma.Error422UnprocessableEntity("Invalid date format parameter")
	ErrNotAuthorizedToDelete          = huma.Error403Forbidden("Not authorized to delete this diary")
	ErrFailedToDelete                 = huma.Error500InternalServerError("Failed to delete diary")
	ErrNotAuthorizedToUploadImage     = huma.Error403Forbidden("Not authorized to upload image to this diary")
	ErrFailedToUploadImage            = huma.Error500InternalServerError("Failed to upload image")
	ErrNotAuthorizedToDeleteImage     = huma.Error403Forbidden("Not authorized to delete image from this diary")
	ErrFailedToDeleteImage            = huma.Error500InternalServerError("Failed to delete image from diary")
	ErrNotAuthorizedToUpdateImage     = huma.Error403Forbidden("Not authorized to update image of this diary")
	ErrFailedToUpdateImage            = huma.Error500InternalServerError("Failed to update image of diary")
	ErrNotAuthorizedToUpdate          = huma.Error403Forbidden("Not authorized to update this diary")
	ErrFailedToUpdate                 = huma.Error500InternalServerError("Failed to update diary")
	ErrNotAuthorizedToUpdateFriends   = huma.Error403Forbidden("Not authorized to update friends of this diary")
	ErrFailedToUpdateFriends          = huma.Error500InternalServerError("Failed to update friends of diary")
	ErrNotAuthorizedToUpdateLocations = huma.Error403Forbidden("Not authorized to update locations of this diary")
	ErrFailedToUpdateLocations        = huma.Error500InternalServerError("Failed to update locations of diary")
)
