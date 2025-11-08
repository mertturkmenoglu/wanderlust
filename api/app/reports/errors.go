package reports

import "github.com/danielgtaylor/huma/v2"

var (
	ErrNotFound            = huma.Error404NotFound("Report not found")
	ErrFailedToList        = huma.Error500InternalServerError("Failed to list reports")
	ErrFailedToGet         = huma.Error500InternalServerError("Failed to get report")
	ErrNotAuthorizedToRead = huma.Error403Forbidden("You don't have permission to access this report")
	ErrUserNotFound        = huma.Error404NotFound("User not found")
	ErrFailedToGetUser     = huma.Error500InternalServerError("Failed to get user")
	ErrFailedToCreate      = huma.Error500InternalServerError("Failed to create report")
	ErrFailedToDelete      = huma.Error500InternalServerError("Failed to delete report")
	ErrFailedToUpdate      = huma.Error500InternalServerError("Failed to update report")
)
