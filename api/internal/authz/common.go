package authz

import "github.com/labstack/echo/v4"

type AuthzAct string

const (
	ActAmenityCreate  AuthzAct = "amenity-create"
	ActAmenityUpdate  AuthzAct = "amenity-update"
	ActBookmarkCreate AuthzAct = "bookmark-create"
	ActBookmarkRead   AuthzAct = "bookmark-read"
	ActBookmarkDelete AuthzAct = "bookmark-delete"
)

type AuthzFn func(s *Authz, c echo.Context) (bool, error)

var Fns = map[AuthzAct]AuthzFn{
	ActAmenityCreate:  IsAdmin,
	ActAmenityUpdate:  IsAdmin,
	ActBookmarkCreate: Identity,
	ActBookmarkRead:   Identity,
	ActBookmarkDelete: Identity,
}
