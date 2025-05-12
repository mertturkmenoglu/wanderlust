package main

import (
	"context"
	"wanderlust/pkg/db"

	"github.com/brianvoe/gofakeit/v7"
	"github.com/jackc/pgx/v5/pgtype"
)

func handleAddresses(count int) error {
	const step = 100
	for i := 0; i < count; i += step {
		if i%100 == 0 {
			logger.Trace("Processing record", logger.Args("index", i))
		}

		err := batchInsertAddresses(step)

		if err != nil {
			return err
		}
	}

	return nil
}

func batchInsertAddresses(n int) error {
	d := GetDb()
	arg := make([]db.BatchCreateAddressesParams, 0, n)
	cityIds, err := d.Queries.RandSelectCities(context.Background(), int32(n))

	if err != nil {
		return err
	}

	for i := range n {
		lat, _ := gofakeit.LatitudeInRange(32, 45)
		lng, _ := gofakeit.LongitudeInRange(-80, -120)

		idx := i % len(cityIds)

		arg = append(arg, db.BatchCreateAddressesParams{
			CityID:     cityIds[idx],
			Line1:      gofakeit.Street(),
			Line2:      pgtype.Text{String: gofakeit.StreetName(), Valid: true},
			PostalCode: pgtype.Text{String: gofakeit.Zip(), Valid: true},
			Lat:        lat,
			Lng:        lng,
		})
	}

	_, err = d.Queries.BatchCreateAddresses(context.Background(), arg)

	return err
}
