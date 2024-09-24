package pois

import (
	"errors"
	"wanderlust/internal/db"

	"github.com/jackc/pgx/v5"
)

func (s *service) peekPois() ([]db.Poi, error) {
	res, err := s.repository.peekPois()

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return []db.Poi{}, nil
		}

		return []db.Poi{}, err
	}

	return res, nil
}

func (s *service) getPoiById(id string) (GetPoiByIdResponseDto, error) {
	dao, err := s.repository.getPoiById(id)

	if err != nil {
		return GetPoiByIdResponseDto{}, err
	}

	return mapGetPoiByIdToDto(dao)
}
