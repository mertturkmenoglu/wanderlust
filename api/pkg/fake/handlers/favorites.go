package handlers

import (
	"context"
	"slices"
	"sync"
	"wanderlust/pkg/db"
	"wanderlust/pkg/fake/fakeutils"

	"github.com/brianvoe/gofakeit/v7"
)

func (f *Fake) HandleFavorites(usersPath string, poisPath string) error {
	userIds, err := fakeutils.ReadFile(usersPath)

	if err != nil {
		return err
	}

	poiIds, err := fakeutils.ReadFile(poisPath)

	if err != nil {
		return err
	}

	var wg sync.WaitGroup
	chunkCount := fakeutils.GetChunkCount(len(userIds), 100)
	errchan := make(chan error, chunkCount)
	sem := make(chan struct{}, 10)

	for chunk := range slices.Chunk(userIds, 100) {
		wg.Add(1)

		go func(chunk []string) {
			defer wg.Done()

			sem <- struct{}{}        // acquire a slot
			defer func() { <-sem }() // release the slot

			err := f.createFavorites(context.Background(), chunk, poiIds)

			if err != nil {
				errchan <- err
			}
		}(chunk)
	}

	wg.Wait()
	close(errchan)

	err = fakeutils.CombineErrors(errchan)

	if err != nil {
		return err
	}

	chunkCount = fakeutils.GetChunkCount(len(poiIds), 100)
	errchan = make(chan error, chunkCount)
	sem = make(chan struct{}, 10)

	for chunk := range slices.Chunk(poiIds, 100) {
		wg.Add(1)

		go func(chunk []string) {
			defer wg.Done()

			sem <- struct{}{}        // acquire a slot
			defer func() { <-sem }() // release the slot

			err := f.updateFavoritesCount(context.Background(), chunk)

			if err != nil {
				errchan <- err
			}
		}(chunk)
	}

	wg.Wait()
	close(errchan)

	return fakeutils.CombineErrors(errchan)
}

func (f *Fake) createFavorites(ctx context.Context, userIds []string, poiIds []string) error {
	batch := make([]db.BatchCreateFavoritesParams, 0)

	for _, userId := range userIds {
		n := gofakeit.Number(10, 20)
		randPois := fakeutils.RandElems(poiIds, n)

		for i := range n {
			batch = append(batch, db.BatchCreateFavoritesParams{
				UserID: userId,
				PoiID:  randPois[i],
			})
		}
	}

	_, err := f.db.Queries.BatchCreateFavorites(ctx, batch)

	return err
}

func (f *Fake) updateFavoritesCount(ctx context.Context, poiIds []string) error {
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

		err = qtx.SetPoiFavoritesCount(ctx, db.SetPoiFavoritesCountParams{
			ID:             poiId,
			TotalFavorites: int32(count),
		})

		if err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
}
