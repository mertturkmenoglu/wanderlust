package users

import (
	"errors"
	"wanderlust/internal/app/api"
	"wanderlust/internal/db"

	"github.com/jackc/pgx/v5"
)

func (s *service) GetUserProfile(username string) (db.GetUserProfileByUsernameRow, *api.ApiError) {
	res, err := s.repository.GetUserProfile(username)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.GetUserProfileByUsernameRow{}, &ErrUserNotFound
		}

		e := api.NewApiError("0000", err)
		return db.GetUserProfileByUsernameRow{}, &e
	}

	return res, nil
}
