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

func (s *service) createCity(dto CreateCityRequestDto) (CreateCityResponseDto, error) {
	res, err := s.repository.createCity(dto)

	if err != nil {
		return CreateCityResponseDto{}, err
	}

	v := mapCreateCityResponseToDto(res)

	return v, nil
}

func (s *service) updateCity(id int32, dto UpdateCityRequestDto) (UpdateCityResponseDto, error) {
	res, err := s.repository.updateCity(id, dto)

	if err != nil {
		return UpdateCityResponseDto{}, err
	}

	v := mapUpdateCityResponseToDto(res)

	return v, nil
}

func (s *service) deleteCity(id int32) error {
	return s.repository.deleteCity(id)
}
