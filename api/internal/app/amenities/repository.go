package amenities

import (
	"context"
	"wanderlust/internal/db"
)

func (r *repository) getAmenities() ([]db.Amenity, error) {
	return r.db.Queries.GetAllAmenities(context.Background())
}
