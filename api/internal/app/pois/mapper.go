package pois

import (
	"encoding/json"
	"wanderlust/internal/db"
	"wanderlust/internal/utils"
)

func mapPeekPoisToDto(v []db.Poi) (PeekPoisResponseDto, error) {
	var pois []PeekPoisItemDto

	for _, poi := range v {
		dto, err := mapPeekPoisItemToDto(poi)

		if err != nil {
			return PeekPoisResponseDto{}, err
		}

		pois = append(pois, dto)
	}

	return PeekPoisResponseDto{
		Pois: pois,
	}, nil
}

func mapPeekPoisItemToDto(v db.Poi) (PeekPoisItemDto, error) {
	openTimes, err := mapOpenTimesToDto(v.OpenTimes)

	if err != nil {
		return PeekPoisItemDto{}, err
	}

	return PeekPoisItemDto{
		ID:                 v.ID,
		Name:               v.Name,
		Phone:              utils.TextOrNil(v.Phone),
		Description:        v.Description,
		AddressID:          v.AddressID,
		Website:            utils.TextOrNil(v.Website),
		PriceLevel:         v.PriceLevel,
		AccessibilityLevel: v.AccessibilityLevel,
		TotalVotes:         v.TotalVotes,
		TotalPoints:        v.TotalPoints,
		TotalFavorites:     v.TotalFavorites,
		CategoryID:         v.CategoryID,
		OpenTimes:          openTimes,
		CreatedAt:          v.CreatedAt.Time,
		UpdatedAt:          v.UpdatedAt.Time,
	}, nil
}

type tmpOpenTimes struct {
	OpenHours []OpenTimes `json:"openhours"`
}

func mapOpenTimesToDto(v []byte) ([]OpenTimes, error) {
	var times tmpOpenTimes

	err := json.Unmarshal(v, &times)

	if err != nil {
		return nil, err
	}

	return times.OpenHours, nil
}

func mapGetPoiByIdToDto(dao GetPoiByIdDao) (GetPoiByIdResponseDto, error) {
	openTimes, err := mapOpenTimesToDto(dao.poi.OpenTimes)

	if err != nil {
		return GetPoiByIdResponseDto{}, err
	}

	media := make([]Media, len(dao.media))

	for i, m := range dao.media {
		media[i] = Media{
			ID:         m.ID,
			PoiID:      dao.poi.ID,
			Url:        m.Url,
			Thumbnail:  m.Thumbnail,
			Alt:        m.Alt,
			Caption:    utils.TextOrNil(m.Caption),
			Width:      m.Width,
			Height:     m.Height,
			MediaOrder: m.MediaOrder,
			Extension:  m.Extension,
			MimeType:   m.MimeType,
			FileSize:   m.FileSize,
			CreatedAt:  m.CreatedAt.Time,
		}
	}

	amenities := make([]Amenity, len(dao.amenities))

	for i, a := range dao.amenities {
		amenities[i] = Amenity{
			ID:   a.Amenity.ID,
			Name: a.Amenity.Name,
		}
	}

	return GetPoiByIdResponseDto{
		ID:                 dao.poi.ID,
		Name:               dao.poi.Name,
		Phone:              utils.TextOrNil(dao.poi.Phone),
		Description:        dao.poi.Description,
		AddressID:          dao.poi.AddressID,
		Website:            utils.TextOrNil(dao.poi.Website),
		PriceLevel:         dao.poi.PriceLevel,
		AccessibilityLevel: dao.poi.AccessibilityLevel,
		TotalVotes:         dao.poi.TotalVotes,
		TotalPoints:        dao.poi.TotalPoints,
		TotalFavorites:     dao.poi.TotalFavorites,
		CategoryID:         dao.poi.CategoryID,
		Media:              media,
		Amenities:          amenities,
		OpenTimes:          openTimes,
		CreatedAt:          dao.poi.CreatedAt.Time,
		UpdatedAt:          dao.poi.UpdatedAt.Time,
		Category: Category{
			ID:    dao.category.ID,
			Name:  dao.category.Name,
			Image: dao.category.Image,
		},
		Address: Address{
			ID:     dao.address.ID,
			CityID: dao.address.CityID,
			City: City{
				ID:          dao.city.ID,
				Name:        dao.city.Name,
				StateCode:   dao.city.StateCode,
				StateName:   dao.city.StateName,
				CountryCode: dao.city.CountryCode,
				CountryName: dao.city.CountryName,
				ImageUrl:    dao.city.ImageUrl,
				Latitude:    dao.city.Latitude,
				Longitude:   dao.city.Longitude,
				Description: dao.city.Description,
			},
			Line1:      dao.address.Line1,
			Line2:      utils.TextOrNil(dao.address.Line2),
			PostalCode: utils.TextOrNil(dao.address.PostalCode),
			Lat:        dao.address.Lat,
			Lng:        dao.address.Lng,
		},
	}, nil
}
