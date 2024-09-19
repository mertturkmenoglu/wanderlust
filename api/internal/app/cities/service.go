package cities

import (
	"errors"
	"wanderlust/internal/app/api"
	"wanderlust/internal/db"

	"github.com/jackc/pgx/v5"
)

func (s *service) getCityById(id int32) (db.City, error) {
	res, err := s.repository.getCityById(id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.City{}, ErrCityNotFound
		}

		return db.City{}, api.InternalServerError
	}

	return res, nil
}

func (s *service) getCities() ([]db.City, error) {
	res, err := s.repository.getCities()

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return []db.City{}, ErrCityNotFound
		}

		return []db.City{}, api.InternalServerError
	}

	return res, nil
}

func (s *service) getFeaturedCities() ([]db.City, error) {
	featuredCitiesIds := []int32{
		1108, // Vienna
		1109, // Istanbul
		1115, // Antalya
		2300, // Athens
		2301, // Thessaloniki
		3012, // Rome
	}
	res, err := s.repository.getFeaturedCities(featuredCitiesIds)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return []db.City{}, ErrCityNotFound
		}

		return []db.City{}, api.InternalServerError
	}

	return res, nil
}
