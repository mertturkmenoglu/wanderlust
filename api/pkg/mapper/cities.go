package mapper

import (
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
)

func ToCity(dbCity db.City) dto.City {
	return dto.City{
		ID:   dbCity.ID,
		Name: dbCity.Name,
		State: dto.CityState{
			Code: dbCity.StateCode,
			Name: dbCity.StateName,
		},
		Country: dto.CityCountry{
			Code: dbCity.CountryCode,
			Name: dbCity.CountryName,
		},
		Image: dbCity.Image,
		Coordinates: dto.CityCoordinates{
			Latitude:  dbCity.Latitude,
			Longitude: dbCity.Longitude,
		},
		Description: dbCity.Description,
	}
}
