package authz

import (
	"github.com/labstack/echo/v4"
)

func IsAdmin(s *Authz, c echo.Context) (bool, error) {
	return false, nil
}

func Identity(s *Authz, c echo.Context) (bool, error) {
	return true, nil
}
