package users

import (
	"errors"
	"wanderlust/internal/app/api"
	"wanderlust/internal/db"

	"github.com/jackc/pgx/v5"
)

func (s *service) GetUserProfile(username string) (db.GetUserProfileByUsernameRow, error) {
	res, err := s.repository.GetUserProfile(username)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.GetUserProfileByUsernameRow{}, ErrUserNotFound
		}

		return db.GetUserProfileByUsernameRow{}, api.InternalServerError
	}

	return res, nil
}

func (s *service) makeUserVerified(id string) error {
	return s.repository.makeUserVerified(id)
}

func (s *service) updateUserProfile(id string, dto UpdateUserProfileRequestDto) (UpdateUserProfileResponseDto, error) {
	res, err := s.repository.updateUserProfile(id, dto)

	if err != nil {
		return UpdateUserProfileResponseDto{}, err
	}

	v := mapUpdateUserProfileResponseToDto(res)

	return v, nil
}