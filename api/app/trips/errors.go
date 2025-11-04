package trips

import "github.com/danielgtaylor/huma/v2"

var (
	ErrFailedToList          = huma.Error500InternalServerError("Failed to list trips")
	ErrNotFound              = huma.Error404NotFound("Trip not found")
	ErrFailedToGet           = huma.Error500InternalServerError("Failed to get trip")
	ErrNotAuthorizedToAccess = huma.Error403Forbidden("Not authorized to access trip")
	ErrFailedToListInvites   = huma.Error500InternalServerError("Failed to list trip invites")
)
