package handlers

import (
	"context"
	"wanderlust/cmd/fake/utils"
	"wanderlust/pkg/db"

	"github.com/brianvoe/gofakeit/v7"
)

func (f *Fake) HandleAmenitiesPois(path string) error {
	ctx := context.Background()

	amenities, err := f.db.Queries.GetAllAmenities(ctx)

	if err != nil {
		return err
	}

	ids, err := utils.ReadFile(path)

	if err != nil {
		return err
	}

	batch := make([]db.BatchCreateAmenitiesPoisParams, 0)

	for _, id := range ids {
		n := gofakeit.IntRange(2, 10)
		tmp := make([]db.Amenity, len(amenities))
		copy(tmp, amenities)
		gofakeit.ShuffleAnySlice(tmp)

		for i := range n {
			aid := tmp[i].ID
			batch = append(batch, db.BatchCreateAmenitiesPoisParams{
				AmenityID: aid,
				PoiID:     id,
			})
		}
	}

	_, err = f.db.Queries.BatchCreateAmenitiesPois(context.Background(), batch)

	return err
}
