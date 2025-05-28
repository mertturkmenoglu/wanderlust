package main

import (
	"context"
	"wanderlust/app/pois"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/search"

	"github.com/sony/sonyflake"
	tsapi "github.com/typesense/typesense-go/v2/typesense/api"
)

func handlePoiSync() error {
	d := GetDb()
	ctx := context.Background()

	totalCount, err := d.Queries.CountPois(ctx)

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

	const step int64 = 1000

	_, err = searchService.Client.Collection(string(search.CollectionPois)).Delete(ctx)

	if err != nil {
		return err
	}

	searchService.CreateSchemas()

	for i = 0; i <= totalCount; i += step {
		logger.Trace("syncing", logger.Args("i", i))
		ids, err := d.Queries.GetPaginatedPoiIds(ctx, db.GetPaginatedPoiIdsParams{
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

		var docs = make([]any, len(pois))

		for i, poi := range pois {
			docs[i] = map[string]any{
				"name":     poi.Name,
				"poi":      poi,
				"location": []float64{poi.Address.Lat, poi.Address.Lng},
			}
		}

		if len(docs) == 0 {
			continue
		}

		_, err = searchService.Client.
			Collection(string(search.CollectionPois)).
			Documents().
			Import(ctx, docs, &tsapi.ImportDocumentsParams{})

		if err != nil {
			return err
		}
	}

	return nil
}
