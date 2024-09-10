package main

import (
	"context"
	"wanderlust/internal/db"

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

	for range n {
		lat, _ := gofakeit.LatitudeInRange(32, 45)
		lng, _ := gofakeit.LongitudeInRange(-80, -120)

		arg = append(arg, db.BatchCreateAddressesParams{
			Country:    gofakeit.CountryAbr(),
			State:      pgtype.Text{String: gofakeit.State(), Valid: true},
			City:       gofakeit.City(),
			Line1:      gofakeit.Street(),
			Line2:      pgtype.Text{String: gofakeit.StreetName(), Valid: true},
			PostalCode: pgtype.Text{String: gofakeit.Zip(), Valid: true},
			Lat:        lat,
			Lng:        lng,
		})
	}

	_, err := d.Queries.BatchCreateAddresses(context.Background(), arg)

	return err
}