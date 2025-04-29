package cities

import (
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/utils"
)

func mapToCityDto(v db.City) CityDto {
	return CityDto{
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

func mapToListDto(v []db.City) ListDto {
	var cities []CityDto

	for _, city := range v {
		cities = append(cities, mapToCityDto(city))
	}

	return ListDto{
		Cities: cities,
	}
}

func mapToFeaturedDto(v []db.City) FeaturedDto {
	var cities []CityDto

	for _, city := range v {
		cities = append(cities, mapToCityDto(city))
	}

	return FeaturedDto{
		Cities: cities,
	}
}

func mapToCreateResDto(v db.City) CreateResDto {
	return CreateResDto{
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

func mapToUpdateResDto(v db.City) UpdateResDto {
	return UpdateResDto{
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
