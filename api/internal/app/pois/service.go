package pois

import (
	"context"
	"encoding/json"
	"errors"
	"time"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/dto"
	"wanderlust/internal/pkg/mapper"
	"wanderlust/internal/pkg/utils"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
)

type Service struct {
	App *core.Application
}

func (s *Service) GetPoisByIds(ids []string) ([]dto.Poi, error) {
	dbPois, err := s.App.Db.Queries.GetPoisByIdsPopulated(context.Background(), ids)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to get point of interests")
	}

	pois := make([]dto.Poi, len(dbPois))

	for i, dbPoi := range dbPois {
		var dbAmenities []db.GetPoiAmenitiesRow = []db.GetPoiAmenitiesRow{}

		if len(dbPoi.Amenities) != 0 {
			err = json.Unmarshal(dbPoi.Amenities, &dbAmenities)

			if err != nil {
				return nil, huma.Error500InternalServerError("failed to unmarshal amenities")
			}
		}

		amenities := mapper.FromGetPoiAmenitiesRowToAmenities(dbAmenities)

		var dbMedia []db.Medium = []db.Medium{}

		if len(dbPoi.Media) != 0 {
			err = json.Unmarshal(dbPoi.Media, &dbMedia)

			if err != nil {
				return nil, huma.Error500InternalServerError("failed to unmarshal media")
			}
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
	res, err := s.GetPoisByIds([]string{id})

	if err != nil {
		return nil, err
	}

	if len(res) != 1 {
		return nil, huma.Error404NotFound("point of interest not found")
	}

	return &res[0], nil
}

func (s *Service) isFavorite(poiId string, userId string) bool {
	_, err := s.App.Db.Queries.IsFavorite(context.Background(), db.IsFavoriteParams{
		PoiID:  poiId,
		UserID: userId,
	})

	return err == nil
}

func (s *Service) isBookmarked(poiId string, userId string) bool {
	_, err := s.App.Db.Queries.IsBookmarked(context.Background(), db.IsBookmarkedParams{
		PoiID:  poiId,
		UserID: userId,
	})

	return err == nil
}

func (s *Service) peekPois() (*dto.PeekPoisOutput, error) {
	dbRes, err := s.App.Db.Queries.PeekPois(context.Background())

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

	res, err := s.GetPoisByIds(ids)

	if err != nil {
		return nil, err
	}

	return &dto.PeekPoisOutput{
		Body: dto.PeekPoisOutputBody{
			Pois: res,
		},
	}, nil
}

func (s *Service) createDraft() (*dto.CreatePoiDraftOutput, error) {
	id := utils.GenerateId(s.App.Flake)
	draft := map[string]any{
		"id": id,
		"v":  2,
	}

	v, err := json.Marshal(draft)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to create draft")
	}

	err = s.App.Cache.Set("poi-draft:"+id, string(v), time.Hour*24*90) // 90 days

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to set draft")
	}

	_, err = s.App.Cache.Client.LPush(context.Background(), "poi-drafts", id).Result()

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to record draft")
	}

	return &dto.CreatePoiDraftOutput{
		Body: dto.CreatePoiDraftOutputBody{
			Draft: draft,
		},
	}, nil
}

func (s *Service) getDrafts() (*dto.GetAllPoiDraftsOutput, error) {
	ids, err := s.App.Cache.Client.LRange(context.Background(), "poi-drafts", 0, -1).Result()

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to get drafts")
	}

	var drafts []map[string]any

	for _, id := range ids {
		v, err := s.App.Cache.Get("poi-draft:" + id)

		if err != nil {
			return nil, huma.Error500InternalServerError("failed to get draft")
		}

		var draft map[string]any

		err = json.Unmarshal([]byte(v), &draft)

		if err != nil {
			return nil, huma.Error500InternalServerError("failed to unmarshal draft")
		}

		drafts = append(drafts, draft)
	}

	return &dto.GetAllPoiDraftsOutput{
		Body: dto.GetAllPoiDraftsOutputBody{
			Drafts: drafts,
		},
	}, nil
}

func (s *Service) getDraft(id string) (*dto.GetPoiDraftOutput, error) {
	v, err := s.App.Cache.Get("poi-draft:" + id)

	if err != nil {
		return nil, huma.Error404NotFound("draft not found")
	}

	var draft map[string]any

	err = json.Unmarshal([]byte(v), &draft)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to unmarshal draft")
	}

	return &dto.GetPoiDraftOutput{
		Body: dto.GetPoiDraftOutputBody{
			Draft: draft,
		},
	}, nil
}
