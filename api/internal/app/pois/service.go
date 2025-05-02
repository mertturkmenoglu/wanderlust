package pois

import (
	"context"
	"encoding/json"
	"errors"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/dto"
	"wanderlust/internal/pkg/mapper"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
)

type Service struct {
	app *core.Application
}

func (s *Service) getPoisByIds(ids []string) ([]dto.Poi, error) {
	dbPois, err := s.app.Db.Queries.GetPoisByIdsPopulated(context.Background(), ids)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to get point of interests")
	}

	pois := make([]dto.Poi, len(dbPois))

	for i, dbPoi := range dbPois {
		var dbAmenities []db.GetPoiAmenitiesRow
		err = json.Unmarshal(dbPoi.Amenities, &dbAmenities)

		if err != nil {
			return nil, huma.Error500InternalServerError("failed to unmarshal amenities")
		}

		amenities := mapper.FromGetPoiAmenitiesRowToAmenities(dbAmenities)

		var dbMedia []db.Medium
		err = json.Unmarshal(dbPoi.Media, &dbMedia)

		if err != nil {
			return nil, huma.Error500InternalServerError("failed to unmarshal media")
		}

		media := mapper.ToMedia(dbMedia)
		openHours, err := mapper.ToOpenHours(dbPoi.Poi.OpenTimes)

		if err != nil {
			return nil, huma.Error500InternalServerError("failed to unmarshal open times")
		}

		pois[i] = mapper.ToPoi(dbPoi.Poi, dbPoi.Category, dbPoi.Address, dbPoi.City, amenities, openHours, media)
	}

	return pois, nil
}

func (s *Service) getPoiById(id string) (*dto.Poi, error) {
	res, err := s.getPoisByIds([]string{id})

	if err != nil {
		return nil, err
	}

	if len(res) != 1 {
		return nil, huma.Error404NotFound("point of interest not found")
	}

	return &res[0], nil
}

func (s *Service) isFavorite(poiId string, userId string) bool {
	_, err := s.app.Db.Queries.IsFavorite(context.Background(), db.IsFavoriteParams{
		PoiID:  poiId,
		UserID: userId,
	})

	return err == nil
}

func (s *Service) isBookmarked(poiId string, userId string) bool {
	_, err := s.app.Db.Queries.IsBookmarked(context.Background(), db.IsBookmarkedParams{
		PoiID:  poiId,
		UserID: userId,
	})

	return err == nil
}

func (s *Service) peekPois() (*dto.PeekPoisOutput, error) {
	dbRes, err := s.app.Db.Queries.PeekPois(context.Background())

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("pois not found")
		}

		return nil, huma.Error500InternalServerError("failed to peek pois")
	}

	ids := make([]string, len(dbRes))

	for i, v := range dbRes {
		ids[i] = v.ID
	}

	res, err := s.getPoisByIds(ids)

	if err != nil {
		return nil, err
	}

	return &dto.PeekPoisOutput{
		Body: dto.PeekPoisOutputBody{
			Pois: res,
		},
	}, nil
}
