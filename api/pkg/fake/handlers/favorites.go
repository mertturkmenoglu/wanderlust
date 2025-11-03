package handlers

import (
	"cmp"
	"context"
	"slices"
	"sync/atomic"
	"wanderlust/pkg/db"
	"wanderlust/pkg/fake/fakeutils"
	"wanderlust/pkg/utils"

	"golang.org/x/sync/errgroup"
)

type FakeFavorites struct {
	UsersPath  string
	PlacesPath string
	*Fake
}

func (f *FakeFavorites) Generate() (int64, error) {
	userIds, placeIds, err := f.readFiles()

	if err != nil {
		return 0, err
	}

	var total atomic.Int64
	g, gctx := errgroup.WithContext(context.Background())
	g.SetLimit(10)

	for chunk := range slices.Chunk(userIds, 100) {
		g.Go(func() error {
			count, err := f.createFavorites(gctx, chunk, placeIds)
			total.Add(count)
			return err
		})
	}

	if err := g.Wait(); err != nil {
		return 0, err
	}

	g, gctx = errgroup.WithContext(context.Background())
	g.SetLimit(10)

	for chunk := range slices.Chunk(placeIds, 100) {
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
	userIds, err1 := fakeutils.ReadFile(f.UsersPath)
	placeIds, err2 := fakeutils.ReadFile(f.PlacesPath)

	if err := cmp.Or(err1, err2); err != nil {
		return nil, nil, err
	}

	return userIds, placeIds, nil
}

func (f *FakeFavorites) createFavorites(ctx context.Context, userIds []string, placeIds []string) (int64, error) {
	batch := make([]db.BatchCreateFavoritesParams, 0)

	for _, userId := range userIds {
		n := fakeutils.RandInt32Range(10, 20)
		randPlaces := fakeutils.RandElems(placeIds, n)

		for i := range n {
			batch = append(batch, db.BatchCreateFavoritesParams{
				UserID:  userId,
				PlaceID: randPlaces[i],
			})
		}
	}

	return f.db.Queries.BatchCreateFavorites(ctx, batch)
}

func (f *FakeFavorites) updateFavoritesCount(ctx context.Context, placeIds []string) error {
	tx, err := f.db.Pool.Begin(ctx)

	if err != nil {
		return err
	}

	defer tx.Rollback(ctx)

	qtx := f.db.Queries.WithTx(tx)

	for _, placeId := range placeIds {
		count, err1 := qtx.CountFavoritesByPlaceId(ctx, placeId)
		total, err2 := utils.SafeInt64ToInt32(count)

		if err := cmp.Or(err1, err2); err != nil {
			return err
		}

		_, err = qtx.UpdatePlaceTotalFavorites(ctx, db.UpdatePlaceTotalFavoritesParams{
			ID:             placeId,
			TotalFavorites: total,
		})

		if err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
}
