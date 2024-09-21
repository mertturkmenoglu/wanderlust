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
