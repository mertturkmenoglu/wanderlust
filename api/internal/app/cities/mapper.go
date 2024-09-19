package cities

import (
	"wanderlust/internal/db"
)

func mapGetCityByIdRowToDto(v db.City) GetCityByIdResponseDto {
	return GetCityByIdResponseDto{
		ID:          v.ID,
		Name:        v.Name,
		StateCode:   v.StateCode,
		StateName:   v.StateName,
		CountryCode: v.CountryCode,
		CountryName: v.CountryName,
		ImageUrl:    v.ImageUrl,
		Latitude:    v.Latitude,
		Longitude:   v.Longitude,
		Description: v.Description,
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
