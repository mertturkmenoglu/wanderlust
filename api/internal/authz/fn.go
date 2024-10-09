package authz

import (
	"context"

	"github.com/labstack/echo/v4"
)

func IsAdmin(s *Authz, c echo.Context) (bool, error) {
	userId, ok := c.Get("user_id").(string)

	if !ok {
		return false, echo.ErrInternalServerError
	}

	res, err := s.Db.Queries.IsAdmin(context.Background(), userId)

	if err != nil {
		return false, err
	}

	return res, nil
}

func Identity(s *Authz, c echo.Context) (bool, error) {
	return true, nil
}

func NotImplemented(s *Authz, c echo.Context) (bool, error) {
	return false, echo.ErrNotImplemented
}
