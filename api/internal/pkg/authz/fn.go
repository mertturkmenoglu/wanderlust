package authz

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
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

func FnListRead(s *Authz, c echo.Context) (bool, error) {
	listId := c.Param("id")

	if listId == "" {
		return false, echo.ErrBadRequest
	}

	list, err := s.Db.Queries.GetListById(context.Background(), listId)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return false, echo.ErrNotFound
		}

		return false, err
	}

	if list.IsPublic {
		return true, nil
	}

	userId, ok := c.Get("user_id").(string)

	if !ok {
		return false, echo.ErrUnauthorized
	}

	if list.UserID == userId {
		return true, nil
	}

	return false, echo.ErrForbidden
}

func FnListDelete(s *Authz, c echo.Context) (bool, error) {
	listId := c.Param("id")

	if listId == "" {
		return false, echo.ErrBadRequest
	}

	list, err := s.Db.Queries.GetListById(context.Background(), listId)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return false, echo.ErrNotFound
		}
		return false, err
	}

	userId, ok := c.Get("user_id").(string)

	if !ok {
		return false, echo.ErrUnauthorized
	}

	if list.UserID == userId {
		return true, nil
	}

	return false, echo.ErrForbidden
}
