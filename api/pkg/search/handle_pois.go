package search

import (
	"context"
	"wanderlust/app/pois"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/utils"

	tsapi "github.com/typesense/typesense-go/v2/typesense/api"
)

func handlePoiSync() error {
	d := db.NewDb()
	ctx := context.Background()

	totalCount, err := d.Queries.CountPois(ctx)

	if err != nil {
		return err
	}

	searchService := New()
	s := pois.NewService(&core.Application{
		Db: d,
	})

	const step int32 = 1000

	_, err = searchService.Client.Collection(string(CollectionPois)).Delete(ctx)

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
		ids, err := d.Queries.GetPaginatedPoiIds(ctx, db.GetPaginatedPoiIdsParams{
			Offset: i,
			Limit:  step,
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
			Collection(string(CollectionPois)).
			Documents().
			Import(ctx, docs, &tsapi.ImportDocumentsParams{})

		if err != nil {
			return err
		}
	}

	return nil
}
