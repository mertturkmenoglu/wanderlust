package authz

import "github.com/labstack/echo/v4"

type AuthzAct string

const (
	ActBookmarkCreate AuthzAct = "bookmark-create"
	ActBookmarkRead   AuthzAct = "bookmark-read"
	ActBookmarkDelete AuthzAct = "bookmark-delete"
)

type AuthzFn func(s *Authz, c echo.Context) (bool, error)

var Fns = map[AuthzAct]AuthzFn{
	ActBookmarkCreate: Identity,
	ActBookmarkRead:   Identity,
	ActBookmarkDelete: Identity,
}
