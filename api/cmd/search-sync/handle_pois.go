package main

import (
	"context"
	"wanderlust/app/pois"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/search"

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

	searchService := search.New()
	s := pois.NewService(&core.Application{
		Db:    d,
		Flake: flake,
	})

	const step int64 = 100
	ctx := context.Background()

	for i = 0; i <= totalCount; i += step {
		logger.Trace("syncing", logger.Args("i", i))
		ids, err := d.Queries.GetPaginatedPoiIds(context.Background(), db.GetPaginatedPoiIdsParams{
			Offset: int32(i),
			Limit:  int32(step),
		})

		if err != nil {
			return err
		}

		pois, err := s.FindMany(ctx, ids)

		if err != nil {
			return err
		}

		for _, poi := range pois {
			_, err = searchService.Client.Collection(string(search.CollectionPois)).Documents().Upsert(context.Background(), map[string]any{
				"name":     poi.Name,
				"poi":      poi,
				"location": []float64{poi.Address.Lat, poi.Address.Lng},
			})

			if err != nil {
				return err
			}
		}
	}

	return nil
}
