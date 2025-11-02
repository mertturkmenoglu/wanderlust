package users

import "github.com/danielgtaylor/huma/v2"

var (
	ErrFailedToUpdateImage      = huma.Error500InternalServerError("Failed to update user image")
	ErrFileNotUploaded          = huma.Error400BadRequest("File not uploaded")
	ErrIncorrectFile            = huma.Error422UnprocessableEntity("Incorrect file uploaded")
	ErrNotFound                 = huma.Error404NotFound("User not found")
	ErrFailedToFetchUser        = huma.Error500InternalServerError("Failed to fetch user")
	ErrFailedToListTopPlaces    = huma.Error500InternalServerError("Failed to list user's top places")
	ErrPlaceNotFound            = huma.Error404NotFound("One or more places not found")
	ErrFailedToUpdateTopPlaces  = huma.Error500InternalServerError("Failed to update user's top places")
	ErrFailedToCheckFollowing   = huma.Error500InternalServerError("Failed to check following status")
	ErrFailedToGetFollowers     = huma.Error500InternalServerError("Failed to get user followers")
	ErrFailedToGetFollowing     = huma.Error500InternalServerError("Failed to get user following")
	ErrFailedToGetActivities    = huma.Error500InternalServerError("Failed to get user activities")
	ErrFailedToSearchFollowing  = huma.Error500InternalServerError("Failed to search user following")
	ErrFailedToMakeUserVerified = huma.Error500InternalServerError("Failed to make user verified")
	ErrFailedToFollow           = huma.Error500InternalServerError("Failed to follow/unfollow user")
	ErrFailedToUpdate           = huma.Error500InternalServerError("Failed to update user information")
)
