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

	if list.List.IsPublic {
		return true, nil
	}

	userId, ok := c.Get("user_id").(string)

	if !ok {
		return false, echo.ErrUnauthorized
	}

	if list.User.ID == userId {
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

	if list.User.ID == userId {
		return true, nil
	}

	return false, echo.ErrForbidden
}

func FnListUpdate(s *Authz, c echo.Context) (bool, error) {
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

	if list.User.ID == userId {
		return true, nil
	}

	return false, echo.ErrForbidden
}

func FnListItemCreate(s *Authz, c echo.Context) (bool, error) {
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

	if list.User.ID == userId {
		return true, nil
	}

	return false, echo.ErrForbidden
}

func FnDiaryUploadMedia(s *Authz, c echo.Context) (bool, error) {
	userId, ok := c.Get("user_id").(string)

	if !ok {
		return false, echo.ErrUnauthorized
	}

	id := c.Param("id")

	if id == "" {
		return false, echo.ErrBadRequest
	}

	diary, err := s.Db.Queries.GetDiaryEntryById(context.Background(), id)

	if err != nil {
		return false, err
	}

	if diary.DiaryEntry.UserID != userId {
		return false, echo.ErrForbidden
	}

	return true, nil
}

func FnDiaryChangeSharing(s *Authz, c echo.Context) (bool, error) {
	userId, ok := c.Get("user_id").(string)

	if !ok {
		return false, echo.ErrUnauthorized
	}

	id := c.Param("id")

	if id == "" {
		return false, echo.ErrBadRequest
	}

	diary, err := s.Db.Queries.GetDiaryEntryById(context.Background(), id)

	if err != nil {
		return false, err
	}

	if diary.DiaryEntry.UserID != userId {
		return false, echo.ErrForbidden
	}

	return true, nil
}

func FnDiaryRead(s *Authz, c echo.Context) (bool, error) {
	userId, ok := c.Get("user_id").(string)

	if !ok {
		return false, echo.ErrUnauthorized
	}

	id := c.Param("id")

	if id == "" {
		return false, echo.ErrBadRequest
	}

	diary, err := s.Db.Queries.GetDiaryEntryById(context.Background(), id)

	if err != nil {
		return false, err
	}

	if diary.DiaryEntry.UserID == userId {
		return true, nil
	}

	if !diary.DiaryEntry.ShareWithFriends {
		return false, echo.ErrForbidden
	}

	users, err := s.Db.Queries.GetDiaryEntryUsers(context.Background(), id)

	if err != nil {
		return false, err
	}

	for _, user := range users {
		if user.Profile.ID == userId {
			return true, nil
		}
	}

	return false, echo.ErrForbidden
}

func FnDiaryDelete(s *Authz, c echo.Context) (bool, error) {
	userId, ok := c.Get("user_id").(string)

	if !ok {
		return false, echo.ErrUnauthorized
	}

	id := c.Param("id")

	if id == "" {
		return false, echo.ErrBadRequest
	}

	diary, err := s.Db.Queries.GetDiaryEntryById(context.Background(), id)

	if err != nil {
		return false, err
	}

	if diary.DiaryEntry.UserID != userId {
		return false, echo.ErrForbidden
	}

	return true, nil
}

func FnReviewDelete(s *Authz, c echo.Context) (bool, error) {
	userId, ok := c.Get("user_id").(string)

	if !ok {
		return false, echo.ErrUnauthorized
	}

	id := c.Param("id")

	if id == "" {
		return false, echo.ErrBadRequest
	}

	review, err := s.Db.Queries.GetReviewById(context.Background(), id)

	if err != nil {
		return false, err
	}

	if review.Review.UserID != userId {
		return false, echo.ErrForbidden
	}

	return true, nil
}

func FnReviewUploadMedia(s *Authz, c echo.Context) (bool, error) {
	userId, ok := c.Get("user_id").(string)

	if !ok {
		return false, echo.ErrUnauthorized
	}

	id := c.Param("id")

	if id == "" {
		return false, echo.ErrBadRequest
	}

	review, err := s.Db.Queries.GetReviewById(context.Background(), id)

	if err != nil {
		return false, err
	}

	if review.Review.UserID != userId {
		return false, echo.ErrForbidden
	}

	return true, nil
}
