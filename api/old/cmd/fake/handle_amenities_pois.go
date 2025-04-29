package main

import (
	"bufio"
	"context"
	"errors"
	"os"
	"wanderlust/internal/pkg/db"

	"github.com/brianvoe/gofakeit/v7"
	"github.com/jackc/pgx/v5"
	"github.com/pterm/pterm"
)

func handleAmenitiesPois() error {
	ctx := context.Background()
	d := GetDb()

	amenities, err := d.Queries.GetAllAmenities(ctx)

	if err != nil {
		return err
	}

	path, _ := pterm.DefaultInteractiveTextInput.Show("Enter path for the file that contains POI ids")
	f, err := os.Open(path)

	if err != nil {
		return err
	}

	defer f.Close()

	scanner := bufio.NewScanner(f)
	i := 1

	for scanner.Scan() {
		if i%100 == 0 {
			logger.Trace("inserting poi amenity", logger.Args("i", i))
		}

		id := scanner.Text()
		n := gofakeit.IntRange(2, 10)
		arg := make([]db.BatchCreateAmenitiesPoisParams, 0)

		for range n {
			aid := amenities[gofakeit.Number(0, len(amenities)-1)].ID
			arg = append(arg, db.BatchCreateAmenitiesPoisParams{
				AmenityID: aid,
				PoiID:     id,
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

		i++
	}

	return scanner.Err()
}
