package lists

import (
	"fmt"

	"github.com/danielgtaylor/huma/v2"
)

var (
	ErrNotFound              = huma.Error404NotFound("List not found")
	ErrFailedToFetch         = huma.Error500InternalServerError("Failed to get list")
	ErrFailedToList          = huma.Error500InternalServerError("Failed to list lists")
	ErrNotAuthorizedToAccess = huma.Error403Forbidden("You are not authorized to access this list")
	ErrFailedToCount         = huma.Error500InternalServerError("Failed to count lists")
	ErrMaxListsReached       = huma.Error422UnprocessableEntity(fmt.Sprintf("You can only have up to %d lists", MAX_LISTS_PER_USER))
	ErrFailedToCreate        = huma.Error500InternalServerError("Failed to create list")
	ErrNotAuthorizedToDelete = huma.Error403Forbidden("You are not authorized to delete this list")
	ErrFailedToDelete        = huma.Error500InternalServerError("Failed to delete list")
	ErrNotAuthorizedToUpdate = huma.Error403Forbidden("You are not authorized to update this list")
	ErrFailedToUpdate        = huma.Error500InternalServerError("Failed to update list")
	ErrFailedToCreateItem    = huma.Error500InternalServerError("Failed to create list item")
	ErrMaxListItemsReached   = huma.Error422UnprocessableEntity(fmt.Sprintf("You can only have up to %d items in a list", MAX_ITEMS_PER_LIST))
	ErrFailedToUpdateItems   = huma.Error500InternalServerError("Failed to update list items")
)
