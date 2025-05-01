package pois

import (
	"context"
	"encoding/json"
	"errors"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/dto"
	"wanderlust/internal/pkg/utils"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
)

type Service struct {
	app *core.Application
}

func (s *Service) getPoiById(id string) (*dto.Poi, error) {
	dbPoi, err := s.app.Db.Queries.GetPoiById(context.Background(), id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("point of interest not found")
		}

		return nil, huma.Error500InternalServerError("failed to get point of interest")
	}

	dbMedia, err := s.app.Db.Queries.GetPoiMedia(context.Background(), id)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to get point of interest media")
	}

	dbAmenities, err := s.app.Db.Queries.GetPoiAmenities(context.Background(), id)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to get point of interest amenities")
	}

	amenities := make([]dto.Amenity, len(dbAmenities))

	for i, a := range dbAmenities {
		amenities[i] = dto.Amenity{
			ID:   a.Amenity.ID,
			Name: a.Amenity.Name,
		}
	}

	media := make([]dto.Media, len(dbMedia))

	for i, m := range dbMedia {
		media[i] = dto.Media{
			ID:         m.ID,
			PoiID:      dbPoi.Poi.ID,
			Url:        m.Url,
			Alt:        m.Alt,
			Caption:    utils.TextToStr(m.Caption),
			MediaOrder: m.MediaOrder,
			CreatedAt:  m.CreatedAt.Time,
		}
	}

	var times map[string]dto.OpenHours

	err = json.Unmarshal(dbPoi.Poi.OpenTimes, &times)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to unmarshal open times")
	}

	return &dto.Poi{
		ID:                 dbPoi.Poi.ID,
		Name:               dbPoi.Poi.Name,
		Phone:              utils.TextToStr(dbPoi.Poi.Phone),
		Description:        dbPoi.Poi.Description,
		AddressID:          dbPoi.Poi.AddressID,
		Website:            utils.TextToStr(dbPoi.Poi.Website),
		PriceLevel:         dbPoi.Poi.PriceLevel,
		AccessibilityLevel: dbPoi.Poi.AccessibilityLevel,
		TotalVotes:         dbPoi.Poi.TotalVotes,
		TotalPoints:        dbPoi.Poi.TotalPoints,
		TotalFavorites:     dbPoi.Poi.TotalFavorites,
		CategoryID:         dbPoi.Poi.CategoryID,
		Category: dto.Category{
			ID:    dbPoi.Category.ID,
			Name:  dbPoi.Category.Name,
			Image: dbPoi.Category.Image,
		},
		Amenities: amenities,
		OpenTimes: times,
		Media:     media,
		Address: dto.Address{
			ID:     dbPoi.Address.ID,
			CityID: dbPoi.Address.CityID,
			City: dto.City{
				ID:   dbPoi.City.ID,
				Name: dbPoi.City.Name,
				State: dto.CityState{
					Code: dbPoi.City.StateCode,
					Name: dbPoi.City.StateName,
				},
				Country: dto.CityCountry{
					Code: dbPoi.City.CountryCode,
					Name: dbPoi.City.CountryName,
				},
				Image: dto.CityImage{
					Url:             dbPoi.City.ImageUrl,
					License:         utils.TextToStr(dbPoi.City.ImgLicense),
					LicenseLink:     utils.TextToStr(dbPoi.City.ImgLicenseLink),
					AttributionLink: utils.TextToStr(dbPoi.City.ImgAttrLink),
					Attribution:     utils.TextToStr(dbPoi.City.ImgAttr),
				},
				Coordinates: dto.CityCoordinates{
					Latitude:  dbPoi.City.Latitude,
					Longitude: dbPoi.City.Longitude,
				},
				Description: dbPoi.City.Description,
			},
			Line1:      dbPoi.Address.Line1,
			Line2:      utils.TextToStr(dbPoi.Address.Line2),
			PostalCode: utils.TextToStr(dbPoi.Address.PostalCode),
			Lat:        dbPoi.Address.Lat,
			Lng:        dbPoi.Address.Lng,
		},
		CreatedAt: dbPoi.Poi.CreatedAt.Time,
		UpdatedAt: dbPoi.Poi.UpdatedAt.Time,
	}, nil
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
