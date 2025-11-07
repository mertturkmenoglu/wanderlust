package bookmarks

import "github.com/danielgtaylor/huma/v2"

var (
	ErrAlreadyBookmarked = huma.Error409Conflict("Place is already bookmarked")
	ErrCreateBookmark    = huma.Error500InternalServerError("Failed to create bookmark")
	ErrNotBookmarked     = huma.Error404NotFound("Place is not bookmarked")
	ErrDeleteBookmark    = huma.Error500InternalServerError("Failed to delete bookmark")
	ErrUserNotFound      = huma.Error404NotFound("User not found")
	ErrFailedToList      = huma.Error500InternalServerError("Failed to list bookmarks")
)
