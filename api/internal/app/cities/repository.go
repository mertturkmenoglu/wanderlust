package cities

import (
	"context"
	"wanderlust/internal/db"
)

func (r *repository) getCityById(id int32) (db.GetCityByIdRow, error) {
	return r.db.Queries.GetCityById(context.Background(), id)
}
