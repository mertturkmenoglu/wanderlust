package favorites

import "github.com/danielgtaylor/huma/v2"

var (
	ErrTransactionFailed = huma.Error500InternalServerError("Transaction failed")
	ErrAlreadyFavorited  = huma.Error422UnprocessableEntity("Point of Interest is already favorited")
	ErrFailedToCreate    = huma.Error500InternalServerError("Failed to create favorite")
	ErrNotFound          = huma.Error404NotFound("Favorite not found")
	ErrFailedToDelete    = huma.Error500InternalServerError("Failed to delete favorite")
	ErrFailedToList      = huma.Error500InternalServerError("Failed to list favorites")
	ErrUserNotFound      = huma.Error404NotFound("User not found")
)
