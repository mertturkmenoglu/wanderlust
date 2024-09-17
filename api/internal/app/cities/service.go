package cities

import (
	"errors"
	"wanderlust/internal/app/api"
	"wanderlust/internal/db"

	"github.com/jackc/pgx/v5"
)

func (s *service) getCityById(id int32) (db.GetCityByIdRow, error) {
	res, err := s.repository.getCityById(id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.GetCityByIdRow{}, ErrCityNotFound
		}

		return db.GetCityByIdRow{}, api.InternalServerError
	}

	return res, nil
}
