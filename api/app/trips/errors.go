package trips

import "github.com/danielgtaylor/huma/v2"

var (
	ErrFailedToList                = huma.Error500InternalServerError("Failed to list trips")
	ErrNotFound                    = huma.Error404NotFound("Trip not found")
	ErrFailedToGet                 = huma.Error500InternalServerError("Failed to get trip")
	ErrNotAuthorizedToAccess       = huma.Error403Forbidden("Not authorized to access trip")
	ErrFailedToListInvites         = huma.Error500InternalServerError("Failed to list trip invites")
	ErrFailedToCreate              = huma.Error500InternalServerError("Failed to create trip")
	ErrNotAutorizedToCreateInvite  = huma.Error403Forbidden("Not authorized to create trip invites")
	ErrCannotInviteToPrivateTrip   = huma.Error400BadRequest("Cannot invite users to a private trip")
	ErrFailedToCreateInvite        = huma.Error500InternalServerError("Failed to create trip invite")
	ErrInviteNotFound              = huma.Error404NotFound("Trip invite not found")
	ErrNotAuthorizedToAccessInvite = huma.Error403Forbidden("Not authorized to access trip invite")
	ErrFailedToDeleteInvite        = huma.Error500InternalServerError("Failed to delete trip invite")
	ErrInviteExpired               = huma.Error410Gone("Trip invite has expired")
)
