package main

import (
	"context"
	"errors"
	"wanderlust/internal/db"

	"github.com/brianvoe/gofakeit/v7"
	"github.com/jackc/pgx/v5"
)

func handleAmenitiesPois(count int) error {
	// Relatively low step value to avoid row collisions
	step := 1000

	if count < step {
		step = count
	}

	ctx := context.Background()
	d := GetDb()

	amenities, err := d.Queries.GetAllAmenities(ctx)

	if err != nil {
		return err
	}

	for i := 0; i < count; i += step {
		logger.Trace("Inserting amenities-pois", logger.Args("index", i))

		if i+step >= count {
			step = count - i
		}

		arg := make([]db.BatchCreateAmenitiesPoisParams, 0, step)
		poiIds, err := d.Queries.RandSelectPois(ctx, int32(step))

		if err != nil {
			return err
		}

		poiIdsLen := len(poiIds)

		for j := range step {
			idx := j % poiIdsLen
			poiId := poiIds[idx]

			amenityId := amenities[gofakeit.Number(0, len(amenities)-1)].ID

			arg = append(arg, db.BatchCreateAmenitiesPoisParams{
				AmenityID: amenityId,
				PoiID:     poiId,
			})
		}

		_, err = d.Queries.BatchCreateAmenitiesPois(ctx, arg)

		if err != nil {
			if errors.Is(err, pgx.ErrTooManyRows) {
				logger.Warn("Too many rows returned. Skipping.", logger.Args("index", i))
			} else {
				return err
			}
		}
	}

	return nil
}
