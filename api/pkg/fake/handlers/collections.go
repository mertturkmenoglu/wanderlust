package handlers

import (
	"cmp"
	"context"
	"slices"
	"sync/atomic"
	"wanderlust/pkg/db"
	"wanderlust/pkg/fake/fakeutils"
	"wanderlust/pkg/id"
	"wanderlust/pkg/utils"

	"github.com/brianvoe/gofakeit/v7"
	"golang.org/x/sync/errgroup"
)

type FakeCollections struct {
	ID *id.Generator
	*Fake
}

func (f *FakeCollections) Generate() (int64, error) {
	count := 10_000
	ctx := context.Background()
	batch := make([]db.BatchCreateCollectionsParams, 0, count)

	for range count {
		batch = append(batch, db.BatchCreateCollectionsParams{
			ID:          f.ID.Flake(),
			Name:        gofakeit.Name(),
			Description: gofakeit.Paragraph(10, 8, 6, " "),
		})
	}

	return f.db.Queries.BatchCreateCollections(ctx, batch)
}

type FakeCollectionItems struct {
	CollectionsPath string
	PoisPath        string
	*Fake
}

func (f *FakeCollectionItems) Generate() (int64, error) {
	collectionIds, poiIds, err := f.readFiles()

	if err != nil {
		return 0, err
	}

	var total atomic.Int64
	g, gctx := errgroup.WithContext(context.Background())
	g.SetLimit(10)

	for chunk := range slices.Chunk(collectionIds, 100) {
		g.Go(func() error {
			count, err := f.createCollectionItems(gctx, chunk, poiIds)
			total.Add(count)
			return err
		})
	}

	if err := g.Wait(); err != nil {
		return 0, err
	}

	return total.Load(), nil
}

func (f *FakeCollectionItems) readFiles() ([]string, []string, error) {
	collectionIds, err := fakeutils.ReadFile(f.CollectionsPath)

	if err != nil {
		return nil, nil, err
	}

	poiIds, err := fakeutils.ReadFile(f.PoisPath)

	if err != nil {
		return nil, nil, err
	}

	return collectionIds, poiIds, nil
}

func (f *FakeCollectionItems) createCollectionItems(ctx context.Context, collectionIds []string, poiIds []string) (int64, error) {
	batch := make([]db.BatchCreateCollectionItemsParams, 0)

	for _, collectionId := range collectionIds {
		pois := fakeutils.RandElems(poiIds, 10)

		for i, poiId := range pois {
			index, err := utils.SafeInt64ToInt32(int64(i))

			if err != nil {
				return 0, err
			}

			batch = append(batch, db.BatchCreateCollectionItemsParams{
				CollectionID: collectionId,
				PoiID:        poiId,
				Index:        index + 1,
			})
		}
	}

	return f.db.Queries.BatchCreateCollectionItems(ctx, batch)
}

type FakeCollectionsCities struct {
	CollectionsPath string
	*Fake
}

func (f *FakeCollectionsCities) Generate() (int64, error) {
	collectionIds, err := fakeutils.ReadFile(f.CollectionsPath)

	if err != nil {
		return 0, err
	}

	cities, err := f.db.Queries.GetCities(context.Background())

	if err != nil {
		return 0, err
	}

	batch := make([]db.BatchCreateCollectionCityRelationsParams, 0, 10*len(cities))

	for _, city := range cities {
		collections := fakeutils.RandElems(collectionIds, 10)

		for i, collectionId := range collections {
			index, err := utils.SafeInt64ToInt32(int64(i))

			if err != nil {
				return 0, err
			}

			batch = append(batch, db.BatchCreateCollectionCityRelationsParams{
				CollectionID: collectionId,
				CityID:       city.ID,
				Index:        index + 1,
			})
		}
	}

	return f.db.Queries.BatchCreateCollectionCityRelations(context.Background(), batch)
}

type FakeCollectionsPois struct {
	CollectionsPath string
	PoisPath        string
	*Fake
}

func (f *FakeCollectionsPois) Generate() (int64, error) {
	collectionIds, poiIds, err := f.readFiles()

	if err != nil {
		return 0, err
	}

	var total atomic.Int64
	g, gctx := errgroup.WithContext(context.Background())
	g.SetLimit(10)

	for chunk := range slices.Chunk(poiIds, 100) {
		g.Go(func() error {
			count, err := f.createCollectionsPois(gctx, chunk, collectionIds)
			total.Add(count)
			return err
		})
	}

	if err := g.Wait(); err != nil {
		return 0, err
	}

	return total.Load(), nil
}

func (f *FakeCollectionsPois) readFiles() ([]string, []string, error) {
	collectionIds, err1 := fakeutils.ReadFile(f.CollectionsPath)
	poiIds, err2 := fakeutils.ReadFile(f.PoisPath)

	if err := cmp.Or(err1, err2); err != nil {
		return nil, nil, err
	}

	return collectionIds, poiIds, nil
}

func (f *FakeCollectionsPois) createCollectionsPois(ctx context.Context, poiIds []string, collectionIds []string) (int64, error) {
	batch := make([]db.BatchCreateCollectionPoiRelationsParams, 0)

	for _, poiId := range poiIds {
		collections := fakeutils.RandElems(collectionIds, 5)

		for i, collectionId := range collections {
			index, err := utils.SafeInt64ToInt32(int64(i))

			if err != nil {
				return 0, err
			}

			batch = append(batch, db.BatchCreateCollectionPoiRelationsParams{
				CollectionID: collectionId,
				PoiID:        poiId,
				Index:        index + 1,
			})
		}
	}

	return f.db.Queries.BatchCreateCollectionPoiRelations(ctx, batch)
}
