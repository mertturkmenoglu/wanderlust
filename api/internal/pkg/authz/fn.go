package authz

import (
	"context"
	"errors"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
)

func IsAdmin(s *Authz, c huma.Context) (bool, error) {
	userId, ok := c.Context().Value("userId").(string)

	if !ok {
		return false, huma.Error401Unauthorized("unauthorized")
	}

	res, err := s.Db.Queries.IsAdmin(context.Background(), userId)

	if err != nil {
		return false, err
	}

	return res, nil
}

func Identity(s *Authz, c huma.Context) (bool, error) {
	return true, nil
}

func NotImplemented(s *Authz, c huma.Context) (bool, error) {
	return false, huma.Error501NotImplemented("not implemented")
}


func FnListRead(s *Authz, c huma.Context) (bool, error) {
	listId := c.Param("id")

	if listId == "" {
		return false, huma.Error400BadRequest("invalid list id")
	}

	list, err := s.Db.Queries.GetListById(context.Background(), listId)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return false, huma.Error404NotFound("list not found")
		}

		return false, err
	}

	if list.List.IsPublic {
		return true, nil
	}

	userId, ok := c.Context().Value("userId").(string)

	if !ok {
		return false, huma.Error401Unauthorized("unauthorized")
	}

	if list.User.ID == userId {
		return true, nil
	}

	return false, huma.Error403Forbidden("forbidden")
}

func FnListDelete(s *Authz, c huma.Context) (bool, error) {
	listId := c.Param("id")

	if listId == "" {
		return false, huma.Error400BadRequest("invalid list id")
	}

	list, err := s.Db.Queries.GetListById(context.Background(), listId)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return false, huma.Error404NotFound("list not found")
		}
		return false, err
	}

	userId, ok := c.Context().Value("userId").(string)

	if !ok {
		return false, huma.Error401Unauthorized("unauthorized")
	}

	if list.User.ID == userId {
		return true, nil
	}

	return false, huma.Error403Forbidden("forbidden")
}

func FnListUpdate(s *Authz, c huma.Context) (bool, error) {
	listId := c.Param("id")

	if listId == "" {
		return false, huma.Error400BadRequest("invalid list id")
	}

	list, err := s.Db.Queries.GetListById(context.Background(), listId)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return false, huma.Error404NotFound("list not found")
		}
		return false, err
	}

	userId, ok := c.Context().Value("userId").(string)

	if !ok {
		return false, huma.Error401Unauthorized("unauthorized")
	}

	if list.User.ID == userId {
		return true, nil
	}

	return false, huma.Error403Forbidden("forbidden")
}

func FnListItemCreate(s *Authz, c huma.Context) (bool, error) {
	listId := c.Param("id")

	if listId == "" {
		return false, huma.Error400BadRequest("invalid list id")
	}

	list, err := s.Db.Queries.GetListById(context.Background(), listId)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return false, huma.Error404NotFound("list not found")
		}

		return false, err
	}

	userId, ok := c.Context().Value("userId").(string)

	if !ok {
		return false, huma.Error401Unauthorized("unauthorized")
	}

	if list.User.ID == userId {
		return true, nil
	}

	return false, huma.Error403Forbidden("forbidden")
}
