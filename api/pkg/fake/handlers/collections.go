package handlers

import (
	"cmp"
	"context"
	"slices"
	"sync/atomic"
	"wanderlust/pkg/db"
	"wanderlust/pkg/fake/fakeutils"
	"wanderlust/pkg/uid"
	"wanderlust/pkg/utils"

	"github.com/brianvoe/gofakeit/v7"
	"golang.org/x/sync/errgroup"
)

type FakeCollections struct {
	*Fake
}

func (f *FakeCollections) Generate() (int64, error) {
	count := 10_000
	ctx := context.Background()
	batch := make([]db.BatchCreateCollectionsParams, 0, count)

	for range count {
		batch = append(batch, db.BatchCreateCollectionsParams{
			ID:          uid.Flake(),
			Name:        gofakeit.Name(),
			Description: gofakeit.Paragraph(10, 8, 6, " "),
		})
	}

	return f.db.Queries.BatchCreateCollections(ctx, batch)
}

type FakeCollectionItems struct {
	CollectionsPath string
	PlacesPath      string
	*Fake
}

func (f *FakeCollectionItems) Generate() (int64, error) {
	collectionIds, placeIds, err := f.readFiles()

	if err != nil {
		return 0, err
	}

	var total atomic.Int64
	g, gctx := errgroup.WithContext(context.Background())
	g.SetLimit(10)

	for chunk := range slices.Chunk(collectionIds, 100) {
		g.Go(func() error {
			count, err := f.createCollectionItems(gctx, chunk, placeIds)
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
	collectionIds, err1 := fakeutils.ReadFile(f.CollectionsPath)
	placeIds, err2 := fakeutils.ReadFile(f.PlacesPath)

	if err := cmp.Or(err1, err2); err != nil {
		return nil, nil, err
	}

	return collectionIds, placeIds, nil
}

func (f *FakeCollectionItems) createCollectionItems(ctx context.Context, collectionIds []string, placeIds []string) (int64, error) {
	batch := make([]db.BatchCreateCollectionItemsParams, 0)

	for _, collectionId := range collectionIds {
		places := fakeutils.RandElems(placeIds, 10)

		for i, placeId := range places {
			index, err := utils.SafeInt64ToInt32(int64(i))

			if err != nil {
				return 0, err
			}

			batch = append(batch, db.BatchCreateCollectionItemsParams{
				CollectionID: collectionId,
				PlaceID:      placeId,
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
	collectionIds, err1 := fakeutils.ReadFile(f.CollectionsPath)
	cities, err2 := f.db.Queries.FindManyCities(context.Background())

	if err := cmp.Or(err1, err2); err != nil {
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

type FakeCollectionsPlaces struct {
	CollectionsPath string
	PlacesPath      string
	*Fake
}

func (f *FakeCollectionsPlaces) Generate() (int64, error) {
	collectionIds, placeIds, err := f.readFiles()

	if err != nil {
		return 0, err
	}

	var total atomic.Int64
	g, gctx := errgroup.WithContext(context.Background())
	g.SetLimit(10)

	for chunk := range slices.Chunk(placeIds, 100) {
		g.Go(func() error {
			count, err := f.createCollectionsPlaces(gctx, chunk, collectionIds)
			total.Add(count)
			return err
		})
	}

	if err := g.Wait(); err != nil {
		return 0, err
	}

	return total.Load(), nil
}

func (f *FakeCollectionsPlaces) readFiles() ([]string, []string, error) {
	collectionIds, err1 := fakeutils.ReadFile(f.CollectionsPath)
	placeIds, err2 := fakeutils.ReadFile(f.PlacesPath)

	if err := cmp.Or(err1, err2); err != nil {
		return nil, nil, err
	}

	return collectionIds, placeIds, nil
}

func (f *FakeCollectionsPlaces) createCollectionsPlaces(ctx context.Context, placeIds []string, collectionIds []string) (int64, error) {
	batch := make([]db.BatchCreateCollectionPlaceRelationsParams, 0)

	for _, placeId := range placeIds {
		collections := fakeutils.RandElems(collectionIds, 5)

		for i, collectionId := range collections {
			index, err := utils.SafeInt64ToInt32(int64(i))

			if err != nil {
				return 0, err
			}

			batch = append(batch, db.BatchCreateCollectionPlaceRelationsParams{
				CollectionID: collectionId,
				PlaceID:      placeId,
				Index:        index + 1,
			})
		}
	}

	return f.db.Queries.BatchCreateCollectionPlaceRelations(ctx, batch)
}
