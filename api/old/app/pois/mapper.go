package pois

import (
	"encoding/json"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/utils"
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

func mapOpenTimesToDto(v []byte) (map[string]OpenHours, error) {
	var times map[string]OpenHours

	err := json.Unmarshal(v, &times)

	if err != nil {
		return nil, err
	}

	return times, nil
}

func mapGetPoiByIdToDto(dao GetPoiByIdDao) (GetPoiByIdResponseDto, error) {
	openTimes, err := mapOpenTimesToDto(dao.Poi.OpenTimes)

	if err != nil {
		return GetPoiByIdResponseDto{}, err
	}

	media := make([]Media, len(dao.Media))

	for i, m := range dao.Media {
		media[i] = Media{
			ID:         m.ID,
			PoiID:      dao.Poi.ID,
			Url:        m.Url,
			Alt:        m.Alt,
			Caption:    utils.TextOrNil(m.Caption),
			MediaOrder: m.MediaOrder,
			CreatedAt:  m.CreatedAt.Time,
		}
	}

	amenities := make([]Amenity, len(dao.Amenities))

	for i, a := range dao.Amenities {
		amenities[i] = Amenity{
			ID:   a.Amenity.ID,
			Name: a.Amenity.Name,
		}
	}

	return GetPoiByIdResponseDto{
		ID:                 dao.Poi.ID,
		Name:               dao.Poi.Name,
		Phone:              utils.TextOrNil(dao.Poi.Phone),
		Description:        dao.Poi.Description,
		AddressID:          dao.Poi.AddressID,
		Website:            utils.TextOrNil(dao.Poi.Website),
		PriceLevel:         dao.Poi.PriceLevel,
		AccessibilityLevel: dao.Poi.AccessibilityLevel,
		TotalVotes:         dao.Poi.TotalVotes,
		TotalPoints:        dao.Poi.TotalPoints,
		TotalFavorites:     dao.Poi.TotalFavorites,
		CategoryID:         dao.Poi.CategoryID,
		Media:              media,
		Amenities:          amenities,
		OpenTimes:          openTimes,
		CreatedAt:          dao.Poi.CreatedAt.Time,
		UpdatedAt:          dao.Poi.UpdatedAt.Time,
		Category: Category{
			ID:    dao.Category.ID,
			Name:  dao.Category.Name,
			Image: dao.Category.Image,
		},
		Address: Address{
			ID:     dao.Address.ID,
			CityID: dao.Address.CityID,
			City: City{
				ID:          dao.City.ID,
				Name:        dao.City.Name,
				StateCode:   dao.City.StateCode,
				StateName:   dao.City.StateName,
				CountryCode: dao.City.CountryCode,
				CountryName: dao.City.CountryName,
				ImageUrl:    dao.City.ImageUrl,
				Latitude:    dao.City.Latitude,
				Longitude:   dao.City.Longitude,
				Description: dao.City.Description,
			},
			Line1:      dao.Address.Line1,
			Line2:      utils.TextOrNil(dao.Address.Line2),
			PostalCode: utils.TextOrNil(dao.Address.PostalCode),
			Lat:        dao.Address.Lat,
			Lng:        dao.Address.Lng,
		},
	}, nil
}
