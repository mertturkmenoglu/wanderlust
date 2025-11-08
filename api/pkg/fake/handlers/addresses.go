package handlers

import (
	"context"
	"wanderlust/pkg/db"
	"wanderlust/pkg/fake/fakeutils"

	"github.com/brianvoe/gofakeit/v7"
	"github.com/jackc/pgx/v5/pgtype"
)

type FakeAddresses struct {
	Count int
	Step  int
	*Fake
}

func (f *FakeAddresses) Generate() (int64, error) {
	var total int64 = 0

	for i := 0; i < f.Count; i += f.Step {
		count, err := f.batchInsert()

		if err != nil {
			return 0, err
		}

		total += count
	}

	return total, nil
}

func (f *FakeAddresses) batchInsert() (int64, error) {
	arg := make([]db.BatchCreateAddressesParams, 0, f.Step)
	cities, err := f.db.Queries.FindManyCities(context.Background())

	if err != nil {
		return 0, err
	}

	for range f.Step {
		randCity := fakeutils.RandElem(cities)

		lat := randCity.Lat + gofakeit.Float64Range(-0.02, 0.02)
		lng := randCity.Lng + gofakeit.Float64Range(-0.02, 0.02)

		arg = append(arg, db.BatchCreateAddressesParams{
			CityID:     randCity.ID,
			Line1:      gofakeit.Street(),
			Line2:      pgtype.Text{String: gofakeit.StreetName(), Valid: true},
			PostalCode: pgtype.Text{String: gofakeit.Zip(), Valid: true},
			Lat:        lat,
			Lng:        lng,
		})
	}

	return f.db.Queries.BatchCreateAddresses(context.Background(), arg)
}
