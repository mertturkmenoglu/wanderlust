package amenities

import (
	"context"
	"wanderlust/internal/pkg/db"
)

func (r *repository) list() ([]db.Amenity, error) {
	return r.di.Db.Queries.GetAllAmenities(context.Background())
}

func (r *repository) update(id int32, dto UpdateReqDto) error {
	return r.di.Db.Queries.UpdateAmenity(context.Background(), db.UpdateAmenityParams{
		ID:   id,
		Name: dto.Name,
	})
}

func (r *repository) create(dto CreateReqDto) (db.Amenity, error) {
	return r.di.Db.Queries.CreateAmenity(context.Background(), dto.Name)
}

func (r *repository) remove(id int32) error {
	return r.di.Db.Queries.DeleteAmenity(context.Background(), id)
}
