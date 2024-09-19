package cities

import (
	"context"
	"wanderlust/internal/db"
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