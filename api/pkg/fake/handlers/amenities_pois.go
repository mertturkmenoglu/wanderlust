package handlers

import (
	"context"
	"wanderlust/pkg/db"
	"wanderlust/pkg/fake/fakeutils"

	"github.com/brianvoe/gofakeit/v7"
)

type FakeAmenitiesPois struct {
	PoisPath string
	*Fake
}

func (f *FakeAmenitiesPois) Generate() (int64, error) {
	ctx := context.Background()
	amenities, err := f.db.Queries.GetAllAmenities(ctx)

	if err != nil {
		return 0, err
	}

	ids, err := fakeutils.ReadFile(f.PoisPath)

	if err != nil {
		return 0, err
	}

	batch := make([]db.BatchCreateAmenitiesPoisParams, 0)

	for _, id := range ids {
		n := gofakeit.IntRange(4, 10)
		randAmenities := fakeutils.RandElems(amenities, n)

		for _, a := range randAmenities {
			batch = append(batch, db.BatchCreateAmenitiesPoisParams{
				AmenityID: a.ID,
				PoiID:     id,
			})
		}
	}

	return f.db.Queries.BatchCreateAmenitiesPois(ctx, batch)
}
