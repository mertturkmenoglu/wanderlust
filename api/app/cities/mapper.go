package cities

import (
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/utils"
)

func mapToCity(dbCity db.City) dto.City {
	return dto.City{
		ID:          dbCity.ID,
		Name:        dbCity.Name,
		Description: dbCity.Description,
		State: dto.CityState{
			Name: dbCity.StateName,
			Code: dbCity.StateCode,
		},
		Country: dto.CityCountry{
			Name: dbCity.CountryName,
			Code: dbCity.CountryCode,
		},
		Image: dto.CityImage{
			Url:             dbCity.ImageUrl,
			License:         utils.TextToStr(dbCity.ImgLicense),
			LicenseLink:     utils.TextToStr(dbCity.ImgLicenseLink),
			Attribution:     utils.TextToStr(dbCity.ImgAttr),
			AttributionLink: utils.TextToStr(dbCity.ImgAttrLink),
		},
		Coordinates: dto.CityCoordinates{
			Latitude:  dbCity.Latitude,
			Longitude: dbCity.Longitude,
		},
	}
}
