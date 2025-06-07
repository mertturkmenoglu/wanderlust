package handlers

import (
	"cmp"
	"context"
	"slices"
	"sync/atomic"
	"wanderlust/pkg/db"
	"wanderlust/pkg/fake/fakeutils"
	"wanderlust/pkg/utils"

	"github.com/brianvoe/gofakeit/v7"
	"golang.org/x/sync/errgroup"
)

type FakeBookmarks struct {
	UsersPath string
	PoisPath  string
	*Fake
}

func (f *FakeBookmarks) Generate() (int64, error) {
	userIds, poiIds, err := f.readFiles()

	if err != nil {
		return 0, err
	}

	var total atomic.Int64
	g, gctx := errgroup.WithContext(context.Background())
	g.SetLimit(10)

	for chunk := range slices.Chunk(userIds, 100) {
		g.Go(func() error {
			count, err := f.createBookmarks(gctx, chunk, poiIds)
			total.Add(count)
			return err
		})
	}

	if err := g.Wait(); err != nil {
		return 0, err
	}

	return total.Load(), nil
}

func (f *FakeBookmarks) readFiles() ([]string, []string, error) {
	userIds, err1 := fakeutils.ReadFile(f.UsersPath)
	poiIds, err2 := fakeutils.ReadFile(f.PoisPath)

	if err := cmp.Or(err1, err2); err != nil {
		return nil, nil, err
	}

	return userIds, poiIds, nil
}

func (f *FakeBookmarks) createBookmarks(ctx context.Context, userIds []string, poiIds []string) (int64, error) {
	batch := make([]db.BatchCreateBookmarksParams, 0)

	for _, userId := range userIds {
		n, err := utils.SafeInt64ToInt32(int64(gofakeit.Number(10, 20)))

		if err != nil {
			return 0, err
		}

		randPois := fakeutils.RandElems(poiIds, n)

		for i := range n {
			batch = append(batch, db.BatchCreateBookmarksParams{
				UserID: userId,
				PoiID:  randPois[i],
			})
		}
	}

	return f.db.Queries.BatchCreateBookmarks(ctx, batch)
}
