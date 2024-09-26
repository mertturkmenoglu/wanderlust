package authz

import "github.com/labstack/echo/v4"

type AuthzAct string

const (
	ActAmenityCreate  AuthzAct = "amenity-create"
	ActAmenityUpdate  AuthzAct = "amenity-update"
	ActAmenityDelete  AuthzAct = "amenity-delete"
	ActBookmarkCreate AuthzAct = "bookmark-create"
	ActBookmarkRead   AuthzAct = "bookmark-read"
	ActBookmarkDelete AuthzAct = "bookmark-delete"
	ActCategoryCreate AuthzAct = "category-create"
	ActCategoryUpdate AuthzAct = "category-update"
	ActCategoryDelete AuthzAct = "category-delete"
	ActCityCreate     AuthzAct = "city-create"
	ActCityUpdate     AuthzAct = "city-update"
	ActCityDelete     AuthzAct = "city-delete"
)

type AuthzFn func(s *Authz, c echo.Context) (bool, error)

var Fns = map[AuthzAct]AuthzFn{
	ActAmenityCreate:  IsAdmin,
	ActAmenityUpdate:  IsAdmin,
	ActAmenityDelete:  IsAdmin,
	ActBookmarkCreate: Identity,
	ActBookmarkRead:   Identity,
	ActBookmarkDelete: Identity,
	ActCategoryCreate: IsAdmin,
	ActCategoryUpdate: IsAdmin,
	ActCategoryDelete: IsAdmin,
	ActCityCreate:     IsAdmin,
	ActCityUpdate:     IsAdmin,
	ActCityDelete:     IsAdmin,
}
