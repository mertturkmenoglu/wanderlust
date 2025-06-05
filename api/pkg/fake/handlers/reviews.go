package handlers

import (
	"context"
	"slices"
	"sync"
	"wanderlust/pkg/db"
	"wanderlust/pkg/fake/fakeutils"

	"github.com/brianvoe/gofakeit/v7"
)

func (f *Fake) HandleReviews(poiPath string, userPath string) error {
	poiIds, err := fakeutils.ReadFile(poiPath)

	if err != nil {
		return err
	}

	userIds, err := fakeutils.ReadFile(userPath)

	if err != nil {
		return err
	}

	var wg sync.WaitGroup
	chunkCount := fakeutils.GetChunkCount(len(poiIds), 100)
	errchan := make(chan error, chunkCount)
	sem := make(chan struct{}, 10)

	for chunk := range slices.Chunk(poiIds, 100) {
		wg.Add(1)

		go func(chunk []string) {
			defer wg.Done()

			sem <- struct{}{}        // acquire a slot
			defer func() { <-sem }() // release the slot

			err := f.createReviews(context.Background(), chunk, userIds)
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

			err := f.updatePoiRateAndVotes(context.Background(), chunk)

			if err != nil {
				errchan <- err
			}
		}(chunk)
	}

	wg.Wait()
	close(errchan)

	return fakeutils.CombineErrors(errchan)
}

func (f *Fake) createReviews(ctx context.Context, poiIds []string, userIds []string) error {
	batch := make([]db.BatchCreateReviewsParams, 0)

	for _, id := range poiIds {
		n := gofakeit.IntRange(1, 40)
		randUserIds := fakeutils.RandElems(userIds, 30)
		res := createReviewForPoi(id, n, randUserIds)
		batch = append(batch, res...)
	}

	_, err := f.db.Queries.BatchCreateReviews(ctx, batch)

	return err
}

func createReviewForPoi(poiId string, count int, userIds []string) []db.BatchCreateReviewsParams {
	batch := make([]db.BatchCreateReviewsParams, 0)

	for range count {
		userId := fakeutils.RandElem(userIds)
		batch = append(batch, db.BatchCreateReviewsParams{
			ID:      gofakeit.UUID(),
			PoiID:   poiId,
			UserID:  userId,
			Content: gofakeit.Paragraph(2, 4, 5, " "),
			Rating:  int16(gofakeit.IntRange(1, 5)),
		})
	}

	return batch
}

func (f *Fake) HandleReviewMedia(reviewPath string) error {
	reviewIds, err := fakeutils.ReadFile(reviewPath)

	if err != nil {
		return err
	}

	var wg sync.WaitGroup
	chunkCount := fakeutils.GetChunkCount(len(reviewIds), 100)
	errchan := make(chan error, chunkCount)
	sem := make(chan struct{}, 10)

	for chunk := range slices.Chunk(reviewIds, 100) {
		wg.Add(1)

		go func(chunk []string) {
			defer wg.Done()

			sem <- struct{}{}        // acquire a slot
			defer func() { <-sem }() // release the slot

			err := f.reviewImages(context.Background(), chunk)
			if err != nil {
				errchan <- err
			}
		}(chunk)
	}

	wg.Wait()
	close(errchan)

	return fakeutils.CombineErrors(errchan)
}

func (f *Fake) reviewImages(ctx context.Context, chunk []string) error {
	batch := make([]db.BatchCreateReviewImageParams, 0)

	for _, id := range chunk {
		// Not all reviews should have media.
		// Skip reviews with a chance of 0.8.
		chance := gofakeit.Float32()

		if chance < 0.8 {
			continue
		}

		n := gofakeit.IntRange(0, 4)
		res := createReviewImages(id, n)
		batch = append(batch, res...)
	}

	_, err := f.db.Queries.BatchCreateReviewImage(ctx, batch)

	return err
}

func createReviewImages(id string, n int) []db.BatchCreateReviewImageParams {
	params := make([]db.BatchCreateReviewImageParams, 0)

	for i := range n {
		params = append(params, db.BatchCreateReviewImageParams{
			ReviewID: id,
			Url:      getRandomImageUrl(),
			Index:    int16(i + 1),
		})
	}

	return params
}

func (f *Fake) updatePoiRateAndVotes(ctx context.Context, poiIds []string) error {
	tx, err := f.db.Pool.Begin(ctx)

	if err != nil {
		return err
	}

	defer tx.Rollback(ctx)

	qtx := f.db.Queries.WithTx(tx)

	for _, poiId := range poiIds {
		count, err := qtx.CountReviewsByPoiId(ctx, poiId)

		if err != nil {
			return err
		}

		totalRating, err := qtx.GetPoiTotalRating(ctx, poiId)

		if err != nil {
			return err
		}

		err = qtx.SetPoiRatingsAndVotes(ctx, db.SetPoiRatingsAndVotesParams{
			ID:             poiId,
			TotalVotes:     int32(count),
			TotalPoints:    int32(totalRating),
		})

		if err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
}