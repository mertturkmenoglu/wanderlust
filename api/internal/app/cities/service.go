package cities

import (
	"errors"
	errs "wanderlust/internal/pkg/core/errors"
	"wanderlust/internal/pkg/db"

	"github.com/jackc/pgx/v5"
)

func (s *service) getCityById(id int32) (db.City, error) {
	res, err := s.repository.getCityById(id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.City{}, ErrCityNotFound
		}

		return db.City{}, errs.InternalServerError
	}

	return res, nil
}

func (s *service) getCities() ([]db.City, error) {
	res, err := s.repository.getCities()

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return []db.City{}, ErrCityNotFound
		}

		return []db.City{}, errs.InternalServerError
	}

	return res, nil
}

func (s *service) getFeaturedCities() ([]db.City, error) {
	featuredCitiesIds := []int32{
		1106, // Salzburg
		1108, // Vienna
		1109, // Istanbul
		2300, // Athens
		3012, // Rome
		3014, // Turin
		3015, // Florence
		3016, // Venice
		4010, // Prague
		5010, // Amsterdam
		6010, // Paris
		7010, // Barcelona
	}
	res, err := s.repository.getFeaturedCities(featuredCitiesIds)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return []db.City{}, ErrCityNotFound
		}

		return []db.City{}, errs.InternalServerError
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
