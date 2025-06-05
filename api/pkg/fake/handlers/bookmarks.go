package handlers

import (
	"context"
	"slices"
	"sync"
	"wanderlust/pkg/db"
	"wanderlust/pkg/fake/fakeutils"

	"github.com/brianvoe/gofakeit/v7"
)

func (f *Fake) HandleBookmarks(usersPath string, poisPath string) error {
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

			err := f.createBookmarks(context.Background(), chunk, poiIds)
			if err != nil {
				errchan <- err
			}
		}(chunk)
	}

	wg.Wait()
	close(errchan)

	return fakeutils.CombineErrors(errchan)
}

func (f *Fake) createBookmarks(ctx context.Context, userIds []string, poiIds []string) error {
	batch := make([]db.BatchCreateBookmarksParams, 0)

	for _, userId := range userIds {
		n := gofakeit.Number(10, 20)
		randPois := fakeutils.RandElems(poiIds, n)

		for i := range n {
			batch = append(batch, db.BatchCreateBookmarksParams{
				UserID: userId,
				PoiID:  randPois[i],
			})
		}
	}

	_, err := f.db.Queries.BatchCreateBookmarks(ctx, batch)

	return err
}
