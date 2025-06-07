package handlers

import (
	"context"
	"slices"
	"sync/atomic"
	"wanderlust/pkg/db"
	"wanderlust/pkg/fake/fakeutils"
	"wanderlust/pkg/utils"

	"github.com/brianvoe/gofakeit/v7"
	"golang.org/x/sync/errgroup"
)

type FakeFavorites struct {
	UsersPath string
	PoisPath  string
	*Fake
}

func (f *FakeFavorites) Generate() (int64, error) {
	userIds, poiIds, err := f.readFiles()

	if err != nil {
		return 0, err
	}

	var total atomic.Int64
	g, gctx := errgroup.WithContext(context.Background())
	g.SetLimit(10)

	for chunk := range slices.Chunk(userIds, 100) {
		g.Go(func() error {
			count, err := f.createFavorites(gctx, chunk, poiIds)
			total.Add(count)
			return err
		})
	}

	if err := g.Wait(); err != nil {
		return 0, err
	}

	g, gctx = errgroup.WithContext(context.Background())
	g.SetLimit(10)

	for chunk := range slices.Chunk(poiIds, 100) {
		g.Go(func() error {
			err := f.updateFavoritesCount(gctx, chunk)
			return err
		})
	}

	if err := g.Wait(); err != nil {
		return 0, err
	}

	return total.Load(), nil
}

func (f *FakeFavorites) readFiles() ([]string, []string, error) {
	userIds, err := fakeutils.ReadFile(f.UsersPath)

	if err != nil {
		return nil, nil, err
	}

	poiIds, err := fakeutils.ReadFile(f.PoisPath)

	if err != nil {
		return nil, nil, err
	}

	return userIds, poiIds, nil
}

func (f *FakeFavorites) createFavorites(ctx context.Context, userIds []string, poiIds []string) (int64, error) {
	batch := make([]db.BatchCreateFavoritesParams, 0)

	for _, userId := range userIds {
		n, err := utils.SafeInt64ToInt32(int64(gofakeit.Number(10, 20)))

		if err != nil {
			return 0, err
		}

		randPois := fakeutils.RandElems(poiIds, n)

		for i := range n {
			batch = append(batch, db.BatchCreateFavoritesParams{
				UserID: userId,
				PoiID:  randPois[i],
			})
		}
	}

	return f.db.Queries.BatchCreateFavorites(ctx, batch)
}

func (f *FakeFavorites) updateFavoritesCount(ctx context.Context, poiIds []string) error {
	tx, err := f.db.Pool.Begin(ctx)

	if err != nil {
		return err
	}

	defer tx.Rollback(ctx)

	qtx := f.db.Queries.WithTx(tx)

	for _, poiId := range poiIds {
		count, err := qtx.GetPoiFavoritesCount(ctx, poiId)

		if err != nil {
			return err
		}

		total, err := utils.SafeInt64ToInt32(count)

		if err != nil {
			return err
		}

		err = qtx.SetPoiFavoritesCount(ctx, db.SetPoiFavoritesCountParams{
			ID:             poiId,
			TotalFavorites: total,
		})

		if err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
}
