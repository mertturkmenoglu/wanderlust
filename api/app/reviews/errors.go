package reviews

import "github.com/danielgtaylor/huma/v2"

var (
	ErrNotFound              = huma.Error404NotFound("Review not found")
	ErrFailedToList          = huma.Error500InternalServerError("Failed to list reviews")
	ErrFailedToCreate        = huma.Error500InternalServerError("Failed to create review")
	ErrFailedToDelete        = huma.Error500InternalServerError("Failed to delete review")
	ErrFailedToUpload        = huma.Error500InternalServerError("Failed to upload review asset")
	ErrFailedToGet           = huma.Error500InternalServerError("Failed to get review")
	ErrNotAuthorizedToDelete = huma.Error403Forbidden("Not authorized to delete this review")
	ErrFailedToGetRatings    = huma.Error500InternalServerError("Failed to get ratings")
	ErrNotAuthorizedToUpload = huma.Error403Forbidden("Not authorized to upload asset for this review")
	ErrFileNotUploaded       = huma.Error400BadRequest("File not uploaded")
	ErrIncorrectFile         = huma.Error400BadRequest("Incorrect file")
)
