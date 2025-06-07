package handlers

import (
	"cmp"
	"context"
	"wanderlust/pkg/db"
	"wanderlust/pkg/fake/fakeutils"
	"wanderlust/pkg/utils"

	"github.com/brianvoe/gofakeit/v7"
)

type FakeAmenitiesPois struct {
	PoisPath string
	*Fake
}

func (f *FakeAmenitiesPois) Generate() (int64, error) {
	ctx := context.Background()
	amenities, err1 := f.db.Queries.GetAllAmenities(ctx)
	ids, err2 := fakeutils.ReadFile(f.PoisPath)

	if err := cmp.Or(err1, err2); err != nil {
		return 0, err
	}

	batch := make([]db.BatchCreateAmenitiesPoisParams, 0)

	for _, id := range ids {
		n, err := utils.SafeInt64ToInt32(int64(gofakeit.IntRange(4, 10)))

		if err != nil {
			return 0, err
		}

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
