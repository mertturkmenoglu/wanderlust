package cities

import (
	"context"
	"wanderlust/internal/pkg/db"
)

func (r *repository) getCityById(id int32) (db.City, error) {
	return r.db.Queries.GetCityById(context.Background(), id)
}

func (r *repository) getCities() ([]db.City, error) {
	return r.db.Queries.GetCities(context.Background())
}

func (r *repository) getFeaturedCities(cityIds []int32) ([]db.City, error) {
	return r.db.Queries.GetFeaturedCities(context.Background(), cityIds)
}

func (r *repository) createCity(dto CreateCityRequestDto) (db.City, error) {
	return r.db.Queries.CreateCity(context.Background(), db.CreateCityParams{
		ID:          dto.ID,
		Name:        dto.Name,
		StateCode:   dto.StateCode,
		StateName:   dto.StateName,
		CountryCode: dto.CountryCode,
		CountryName: dto.CountryName,
		ImageUrl:    dto.ImageUrl,
		Latitude:    dto.Latitude,
		Longitude:   dto.Longitude,
		Description: dto.Description,
	})
}

func (r *repository) updateCity(id int32, dto UpdateCityRequestDto) (db.City, error) {
	return r.db.Queries.UpdateCity(context.Background(), db.UpdateCityParams{
		ID:          id,
		Name:        dto.Name,
		StateCode:   dto.StateCode,
		StateName:   dto.StateName,
		CountryCode: dto.CountryCode,
		CountryName: dto.CountryName,
		ImageUrl:    dto.ImageUrl,
		Latitude:    dto.Latitude,
		Longitude:   dto.Longitude,
		Description: dto.Description,
	})
}

func (r *repository) deleteCity(id int32) error {
	return r.db.Queries.DeleteCity(context.Background(), id)
}
