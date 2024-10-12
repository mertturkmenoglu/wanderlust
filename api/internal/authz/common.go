package authz

import "github.com/labstack/echo/v4"

type AuthzAct string

const (
	ActAmenityCreate        AuthzAct = "amenity-create"
	ActAmenityUpdate        AuthzAct = "amenity-update"
	ActAmenityDelete        AuthzAct = "amenity-delete"
	ActBookmarkCreate       AuthzAct = "bookmark-create"
	ActBookmarkRead         AuthzAct = "bookmark-read"
	ActBookmarkDelete       AuthzAct = "bookmark-delete"
	ActCategoryCreate       AuthzAct = "category-create"
	ActCategoryUpdate       AuthzAct = "category-update"
	ActCategoryDelete       AuthzAct = "category-delete"
	ActCityCreate           AuthzAct = "city-create"
	ActCityUpdate           AuthzAct = "city-update"
	ActCityDelete           AuthzAct = "city-delete"
	ActMakeUserVerified     AuthzAct = "make-user-verified"
	ActPoiMediaUpload       AuthzAct = "poi-media-upload"
	ActPoiMediaDelete       AuthzAct = "poi-media-delete"
	ActPoiDraftCreate       AuthzAct = "poi-draft-create"
	ActPoiDraftRead         AuthzAct = "poi-draft-read"
	ActPoiDraftUpdate       AuthzAct = "poi-draft-update"
	ActPoiDraftDelete       AuthzAct = "poi-draft-delete"
	ActPoiDraftPublish      AuthzAct = "poi-draft-publish"
	ActCollectionCreate     AuthzAct = "collection-create"
	ActCollectionRead       AuthzAct = "collection-read"
	ActCollectionUpdate     AuthzAct = "collection-update"
	ActCollectionDelete     AuthzAct = "collection-delete"
	ActCollectionItemCreate AuthzAct = "collection-item-create"
	ActCollectionItemRead   AuthzAct = "collection-item-read"
	ActCollectionItemUpdate AuthzAct = "collection-item-update"
	ActCollectionItemDelete AuthzAct = "collection-item-delete"
	ActListCreate           AuthzAct = "list-create"
	ActListRead             AuthzAct = "list-read"
	ActListUpdate           AuthzAct = "list-update"
	ActListDelete           AuthzAct = "list-delete"
	ActListItemCreate       AuthzAct = "list-item-create"
	ActListItemRead         AuthzAct = "list-item-read"
	ActListItemUpdate       AuthzAct = "list-item-update"
	ActListItemDelete       AuthzAct = "list-item-delete"
)

type AuthzFn func(s *Authz, c echo.Context) (bool, error)

var Fns = map[AuthzAct]AuthzFn{
	ActAmenityCreate:        IsAdmin,
	ActAmenityUpdate:        IsAdmin,
	ActAmenityDelete:        IsAdmin,
	ActBookmarkCreate:       Identity,
	ActBookmarkRead:         Identity,
	ActBookmarkDelete:       Identity,
	ActCategoryCreate:       IsAdmin,
	ActCategoryUpdate:       IsAdmin,
	ActCategoryDelete:       IsAdmin,
	ActCityCreate:           IsAdmin,
	ActCityUpdate:           IsAdmin,
	ActCityDelete:           IsAdmin,
	ActMakeUserVerified:     IsAdmin,
	ActPoiMediaUpload:       IsAdmin,
	ActPoiMediaDelete:       IsAdmin,
	ActPoiDraftCreate:       IsAdmin,
	ActPoiDraftRead:         IsAdmin,
	ActPoiDraftUpdate:       IsAdmin,
	ActPoiDraftDelete:       IsAdmin,
	ActPoiDraftPublish:      IsAdmin,
	ActCollectionCreate:     IsAdmin,
	ActCollectionRead:       IsAdmin,
	ActCollectionUpdate:     IsAdmin,
	ActCollectionDelete:     IsAdmin,
	ActCollectionItemCreate: IsAdmin,
	ActCollectionItemRead:   IsAdmin,
	ActCollectionItemUpdate: IsAdmin,
	ActCollectionItemDelete: IsAdmin,
	ActListCreate:           Identity,
	ActListRead:             FnListRead,
	ActListUpdate:           NotImplemented,
	ActListDelete:           FnListDelete,
	ActListItemCreate:       NotImplemented,
	ActListItemRead:         NotImplemented,
	ActListItemUpdate:       NotImplemented,
	ActListItemDelete:       NotImplemented,
}
