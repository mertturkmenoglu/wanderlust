package search

import (
	"context"
	"wanderlust/app/places"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/di"
	"wanderlust/pkg/utils"

	tsapi "github.com/typesense/typesense-go/v2/typesense/api"
)

func handlePlacesSync() error {
	d := db.NewDb()
	ctx := context.Background()

	totalCount, err := d.Queries.CountPlaces(ctx)

	if err != nil {
		return err
	}

	ioc := di.New()

	ioc.Set(di.SVC_DB, d)
	ioc.Set(di.SVC_CACHE, cache.New())

	searchService := New()
	s := places.NewService(&core.Application{
		Container: ioc,
	})

	const step int32 = 1000

	_, err = searchService.Client.Collection(string(CollectionPlaces)).Delete(ctx)

	if err != nil {
		return err
	}

	searchService.CreateSchemas()

	var i int32
	n, err := utils.SafeInt64ToInt32(totalCount)

	if err != nil {
		return err
	}

	for i = 0; i <= n; i += step {
		ids, err := d.Queries.FindManyPlaceIds(ctx, db.FindManyPlaceIdsParams{
			Offset: i,
			Limit:  step,
		})

		if err != nil {
			return err
		}

		places, err := s.FindMany(ctx, ids)

		if err != nil {
			return err
		}

		var docs = make([]any, len(places))

		for i, place := range places {
			docs[i] = map[string]any{
				"name":     place.Name,
				"place":    place,
				"location": []float64{place.Address.Lat, place.Address.Lng},
			}
		}

		if len(docs) == 0 {
			continue
		}

		_, err = searchService.Client.
			Collection(string(CollectionPlaces)).
			Documents().
			Import(ctx, docs, &tsapi.ImportDocumentsParams{})

		if err != nil {
			return err
		}
	}

	return nil
}
