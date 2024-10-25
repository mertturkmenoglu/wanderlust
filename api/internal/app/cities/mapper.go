package cities

import (
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/utils"
)

func mapGetCityByIdRowToDto(v db.City) GetCityByIdResponseDto {
	return GetCityByIdResponseDto{
		ID:                   v.ID,
		Name:                 v.Name,
		StateCode:            v.StateCode,
		StateName:            v.StateName,
		CountryCode:          v.CountryCode,
		CountryName:          v.CountryName,
		ImageUrl:             v.ImageUrl,
		Latitude:             v.Latitude,
		Longitude:            v.Longitude,
		Description:          v.Description,
		ImageLicense:         utils.TextOrNil(v.ImgLicense),
		ImageLicenseLink:     utils.TextOrNil(v.ImgLicenseLink),
		ImageAttribution:     utils.TextOrNil(v.ImgAttr),
		ImageAttributionLink: utils.TextOrNil(v.ImgAttrLink),
	}
}

func mapGetCitiesToDto(v []db.City) GetCitiesResponseDto {
	var cities []GetCityByIdResponseDto

	for _, city := range v {
		cities = append(cities, mapGetCityByIdRowToDto(city))
	}

	return GetCitiesResponseDto{
		Cities: cities,
	}
}

func mapGetFeaturedCitiesToDto(v []db.City) GetFeaturedCitiesResponseDto {
	var cities []GetCityByIdResponseDto

	for _, city := range v {
		cities = append(cities, mapGetCityByIdRowToDto(city))
	}

	return GetFeaturedCitiesResponseDto{
		Cities: cities,
	}
}

func mapCreateCityResponseToDto(v db.City) CreateCityResponseDto {
	return CreateCityResponseDto{
		ID:                   int32(v.ID),
		Name:                 v.Name,
		StateCode:            v.StateCode,
		StateName:            v.StateName,
		CountryCode:          v.CountryCode,
		CountryName:          v.CountryName,
		ImageUrl:             v.ImageUrl,
		Latitude:             v.Latitude,
		Longitude:            v.Longitude,
		Description:          v.Description,
		ImageLicense:         utils.TextOrNil(v.ImgLicense),
		ImageLicenseLink:     utils.TextOrNil(v.ImgLicenseLink),
		ImageAttribution:     utils.TextOrNil(v.ImgAttr),
		ImageAttributionLink: utils.TextOrNil(v.ImgAttrLink),
	}
}

func mapUpdateCityResponseToDto(v db.City) UpdateCityResponseDto {
	return UpdateCityResponseDto{
		ID:                   int32(v.ID),
		Name:                 v.Name,
		StateCode:            v.StateCode,
		StateName:            v.StateName,
		CountryCode:          v.CountryCode,
		CountryName:          v.CountryName,
		ImageUrl:             v.ImageUrl,
		Latitude:             v.Latitude,
		Longitude:            v.Longitude,
		Description:          v.Description,
		ImageLicense:         utils.TextOrNil(v.ImgLicense),
		ImageLicenseLink:     utils.TextOrNil(v.ImgLicenseLink),
		ImageAttribution:     utils.TextOrNil(v.ImgAttr),
		ImageAttributionLink: utils.TextOrNil(v.ImgAttrLink),
	}
}
