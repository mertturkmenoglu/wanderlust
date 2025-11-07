package handlers

import (
	"cmp"
	"context"
	"slices"
	"sync/atomic"
	"wanderlust/pkg/db"
	"wanderlust/pkg/fake/fakeutils"
	"wanderlust/pkg/uid"

	"github.com/brianvoe/gofakeit/v7"
	"golang.org/x/sync/errgroup"
)

type FakeLists struct {
	UsersPath string
	*Fake
}

func (f *FakeLists) Generate() (int64, error) {
	userIds, err := fakeutils.ReadFile(f.UsersPath)

	if err != nil {
		return 0, err
	}

	var total atomic.Int64
	g, gctx := errgroup.WithContext(context.Background())
	g.SetLimit(10)

	for chunk := range slices.Chunk(userIds, 100) {
		g.Go(func() error {
			count, err := f.createLists(gctx, chunk)
			total.Add(count)
			return err
		})
	}

	if err := g.Wait(); err != nil {
		return 0, err
	}

	return total.Load(), nil
}

func (f *FakeLists) createLists(ctx context.Context, userIds []string) (int64, error) {
	batch := make([]db.BatchCreateListsParams, 0)

	for _, userId := range userIds {
		n := gofakeit.Number(1, 5)
		for range n {
			batch = append(batch, db.BatchCreateListsParams{
				ID:       uid.Flake(),
				Name:     gofakeit.HipsterSentence(4),
				UserID:   userId,
				IsPublic: gofakeit.Bool(),
			})
		}
	}

	return f.db.Queries.BatchCreateLists(ctx, batch)
}

type FakeListItems struct {
	ListsPath  string
	PlacesPath string
	*Fake
}

func (f *FakeListItems) Generate() (int64, error) {
	listIds, placeIds, err := f.readFiles()

	if err != nil {
		return 0, err
	}

	var total atomic.Int64
	g, gctx := errgroup.WithContext(context.Background())
	g.SetLimit(10)

	for chunk := range slices.Chunk(listIds, 100) {
		g.Go(func() error {
			count, err := f.createListItems(gctx, chunk, placeIds)
			total.Add(count)
			return err
		})
	}

	if err := g.Wait(); err != nil {
		return 0, err
	}

	return total.Load(), nil
}

func (f *FakeListItems) readFiles() ([]string, []string, error) {
	listIds, err1 := fakeutils.ReadFile(f.ListsPath)
	placeIds, err2 := fakeutils.ReadFile(f.PlacesPath)

	if err := cmp.Or(err1, err2); err != nil {
		return nil, nil, err
	}

	return listIds, placeIds, nil
}

func (f *FakeListItems) createListItems(ctx context.Context, listIds []string, placeIds []string) (int64, error) {
	batch := make([]db.BatchCreateListItemsParams, 0)

	for _, listId := range listIds {
		n := fakeutils.RandInt32Range(4, 10)
		randPlaces := fakeutils.RandElems(placeIds, n)

		for i := range n {
			batch = append(batch, db.BatchCreateListItemsParams{
				ListID:  listId,
				PlaceID: randPlaces[i],
				Index:   i + 1,
			})
		}
	}

	return f.db.Queries.BatchCreateListItems(ctx, batch)
}
