package cities

import (
	"errors"
	errs "wanderlust/internal/pkg/core/errors"

	"github.com/jackc/pgx/v5"
)

func (s *service) get(id int32) (CityDto, error) {
	res, err := s.repository.get(id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return CityDto{}, ErrCityNotFound
		}

		return CityDto{}, errs.InternalServerError
	}

	v := mapToCityDto(res)

	return v, nil
}

func (s *service) list() (ListDto, error) {
	res, err := s.repository.list()

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ListDto{}, ErrCityNotFound
		}

		return ListDto{}, errs.InternalServerError
	}

	v := mapToListDto(res)

	return v, nil
}

func (s *service) featured() (FeaturedDto, error) {
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
	res, err := s.repository.featured(featuredCitiesIds)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return FeaturedDto{}, ErrCityNotFound
		}

		return FeaturedDto{}, errs.InternalServerError
	}

	v := mapToFeaturedDto(res)

	return v, nil
}

func (s *service) create(dto CreateReqDto) (CreateResDto, error) {
	res, err := s.repository.create(dto)

	if err != nil {
		return CreateResDto{}, err
	}

	v := mapToCreateResDto(res)

	return v, nil
}

func (s *service) update(id int32, dto UpdateReqDto) (UpdateResDto, error) {
	res, err := s.repository.update(id, dto)

	if err != nil {
		return UpdateResDto{}, err
	}

	v := mapToUpdateResDto(res)

	return v, nil
}

func (s *service) remove(id int32) error {
	return s.repository.remove(id)
}
