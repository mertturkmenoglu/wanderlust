package collections

import "github.com/danielgtaylor/huma/v2"

var (
	ErrNoCollectionFound               = huma.Error404NotFound("No collection found")
	ErrFailedToList                    = huma.Error500InternalServerError("Failed to list collections")
	ErrNotFound                        = huma.Error404NotFound("Collection not found")
	ErrFailedToCount                   = huma.Error500InternalServerError("Failed to count collections")
	ErrFailedToCreate                  = huma.Error500InternalServerError("Failed to create collection")
	ErrFailedToDelete                  = huma.Error500InternalServerError("Failed to delete collection")
	ErrFailedToUpdate                  = huma.Error500InternalServerError("Failed to update collection")
	ErrFailedToCreateItem              = huma.Error500InternalServerError("Failed to create collection item")
	ErrFailedToDeleteItem              = huma.Error500InternalServerError("Failed to delete collection item")
	ErrItemNotFound                    = huma.Error404NotFound("Collection item not found")
	ErrFailedToUpdateItems             = huma.Error500InternalServerError("Failed to update collection items")
	ErrInvalidItemOrder                = huma.Error422UnprocessableEntity("Invalid item order")
	ErrFailedToCreatePlaceRelation     = huma.Error500InternalServerError("Failed to create collection place relation")
	ErrFailedToDeletePlaceRelation     = huma.Error500InternalServerError("Failed to delete collection place relation")
	ErrFailedToCreateCityRelation      = huma.Error500InternalServerError("Failed to create collection city relation")
	ErrFailedToDeleteCityRelation      = huma.Error500InternalServerError("Failed to delete collection city relation")
	ErrFailedToListPlaceCollections    = huma.Error500InternalServerError("Failed to list place collections")
	ErrFailedToListCityCollections     = huma.Error500InternalServerError("Failed to list city collections")
	ErrFailedToListAllPlaceCollections = huma.Error500InternalServerError("Failed to list all place collections")
	ErrFailedToListAllCityCollections  = huma.Error500InternalServerError("Failed to list all city collections")
)
