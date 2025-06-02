package main

import (
	"context"
	"wanderlust/pkg/db"

	"github.com/brianvoe/gofakeit/v7"
	"github.com/pterm/pterm"
)

func handleAmenitiesPois(path string) error {
	ctx := context.Background()
	d := GetDb()

	amenities, err := d.Queries.GetAllAmenities(ctx)

	if err != nil {
		return err
	}

	if path == "" {
		path, _ = pterm.DefaultInteractiveTextInput.Show("Enter path for the file that contains POI ids")
	}

	logger.Info("Starting amenities generation for POIs")

	ids, err := readFile(path)

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

	_, err = GetDb().Queries.BatchCreateAmenitiesPois(context.Background(), batch)

	logger.Info("Ending amenities generation for POIs")

	return err
}
