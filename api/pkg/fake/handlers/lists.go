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

type FakeLists struct {
	UsersPath string
	ID        *id.Generator
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
				ID:       f.ID.Flake(),
				Name:     gofakeit.HipsterSentence(4),
				UserID:   userId,
				IsPublic: gofakeit.Bool(),
			})
		}
	}

	return f.db.Queries.BatchCreateLists(ctx, batch)
}

type FakeListItems struct {
	ListsPath string
	PoisPath  string
	*Fake
}

func (f *FakeListItems) Generate() (int64, error) {
	listIds, poiIds, err := f.readFiles()

	if err != nil {
		return 0, err
	}

	var total atomic.Int64
	g, gctx := errgroup.WithContext(context.Background())
	g.SetLimit(10)

	for chunk := range slices.Chunk(listIds, 100) {
		g.Go(func() error {
			count, err := f.createListItems(gctx, chunk, poiIds)
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
	poiIds, err2 := fakeutils.ReadFile(f.PoisPath)

	if err := cmp.Or(err1, err2); err != nil {
		return nil, nil, err
	}

	return listIds, poiIds, nil
}

func (f *FakeListItems) createListItems(ctx context.Context, listIds []string, poiIds []string) (int64, error) {
	batch := make([]db.BatchCreateListItemsParams, 0)

	for _, listId := range listIds {
		n, err := utils.SafeInt64ToInt32(int64(gofakeit.Number(4, 10)))

		if err != nil {
			return 0, err
		}

		randPois := fakeutils.RandElems(poiIds, n)

		for i := range n {
			batch = append(batch, db.BatchCreateListItemsParams{
				ListID: listId,
				PoiID:  randPois[i],
				Index:  i + 1,
			})
		}
	}

	return f.db.Queries.BatchCreateListItems(ctx, batch)
}
