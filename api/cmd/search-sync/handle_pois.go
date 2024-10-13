package main

import (
	"context"
	"wanderlust/internal/app/pois"
	"wanderlust/internal/db"
	"wanderlust/internal/search"

	"github.com/sony/sonyflake"
)

func handlePoiSync() error {
	d := GetDb()

	totalCount, err := d.Queries.CountPois(context.Background())

	if err != nil {
		return err
	}

	var i int64 = 0
	flake, err := sonyflake.New(sonyflake.Settings{})

	if err != nil {
		return err
	}

	repo := pois.Repository{
		Db:    d,
		Flake: flake,
	}

	searchService := search.New()

	const step int64 = 10

	for i = 0; i <= totalCount; i += step {
		ids, err := d.Queries.GetPaginatedPoiIds(context.Background(), db.GetPaginatedPoiIdsParams{
			Offset: int32(i),
			Limit:  int32(step),
		})

		if err != nil {
			return err
		}

		for _, id := range ids {
			poi, err := repo.GetPoiById(id)

			if err != nil {
				return err
			}

			_, err = searchService.Client.Collection(string(search.CollectionPois)).Documents().Upsert(context.Background(), map[string]any{
				"name": poi.Poi.Name,
				"poi":  poi,
			})

			if err != nil {
				return err
			}
		}
	}

	return nil
}
