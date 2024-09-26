package amenities

import (
	"context"
	"wanderlust/internal/db"
)

func (r *repository) getAmenities() ([]db.Amenity, error) {
	return r.db.Queries.GetAllAmenities(context.Background())
}

func (r *repository) updateAmenity(id int32, dto UpdateAmenityRequestDto) error {
	return r.db.Queries.UpdateAmenity(context.Background(), db.UpdateAmenityParams{
		ID:   id,
		Name: dto.Name,
	})
}

func (r *repository) createAmenity(dto CreateAmenityRequestDto) (db.Amenity, error) {
	return r.db.Queries.CreateAmenity(context.Background(), dto.Name)
}
