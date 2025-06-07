package handlers

import (
	"context"
	"fmt"
	"slices"
	"sync/atomic"
	"wanderlust/pkg/db"
	"wanderlust/pkg/fake/fakeutils"
	"wanderlust/pkg/utils"

	"github.com/brianvoe/gofakeit/v7"
	"golang.org/x/sync/errgroup"
)

type FakeReviews struct {
	PoisPath  string
	UsersPath string
	*Fake
}

func (f *FakeReviews) Generate() (int64, error) {
	poiIds, userIds, err := f.readFiles()

	if err != nil {
		return 0, err
	}

	var total atomic.Int64
	g, gctx := errgroup.WithContext(context.Background())
	g.SetLimit(10)

	for chunk := range slices.Chunk(poiIds, 100) {
		g.Go(func() error {
			count, err := f.createReviews(gctx, chunk, userIds)
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
			err := f.updatePoiRateAndVotes(gctx, chunk)
			return err
		})
	}

	if err := g.Wait(); err != nil {
		return 0, err
	}

	return total.Load(), nil
}

func (f *FakeReviews) readFiles() ([]string, []string, error) {
	poiIds, err := fakeutils.ReadFile(f.PoisPath)

	if err != nil {
		return nil, nil, err
	}

	userIds, err := fakeutils.ReadFile(f.UsersPath)

	if err != nil {
		return nil, nil, err
	}

	return poiIds, userIds, nil
}

func (f *FakeReviews) createReviews(ctx context.Context, poiIds []string, userIds []string) (int64, error) {
	batch := make([]db.BatchCreateReviewsParams, 0)

	for _, poiId := range poiIds {
		n := gofakeit.IntRange(1, 40)

		for range n {
			userId := fakeutils.RandElem(userIds)
			rating, err := utils.SafeInt64ToInt16(int64(gofakeit.IntRange(1, 5)))

			if err != nil {
				return 0, err
			}

			batch = append(batch, db.BatchCreateReviewsParams{
				ID:      gofakeit.UUID(),
				PoiID:   poiId,
				UserID:  userId,
				Content: gofakeit.Paragraph(2, 4, 5, " "),
				Rating:  rating,
			})
		}
	}

	return f.db.Queries.BatchCreateReviews(ctx, batch)
}

func (f *FakeReviews) updatePoiRateAndVotes(ctx context.Context, poiIds []string) error {
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

		cast, ok := totalRating.(int64)

		if !ok {
			return fmt.Errorf("invalid type: %T", totalRating)
		}

		votesInt32, err := utils.SafeInt64ToInt32(count)

		if err != nil {
			return err
		}

		pointsInt32, err := utils.SafeInt64ToInt32(cast)

		if err != nil {
			return err
		}

		err = qtx.SetPoiRatingsAndVotes(ctx, db.SetPoiRatingsAndVotesParams{
			ID:          poiId,
			TotalVotes:  votesInt32,
			TotalPoints: pointsInt32,
		})

		if err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
}

type FakeReviewImages struct {
	ReviewsPath string
	*Fake
}

func (f *FakeReviewImages) Generate() (int64, error) {
	reviewIds, err := fakeutils.ReadFile(f.ReviewsPath)

	if err != nil {
		return 0, err
	}

	var total atomic.Int64
	g, gctx := errgroup.WithContext(context.Background())
	g.SetLimit(10)

	for chunk := range slices.Chunk(reviewIds, 100) {
		g.Go(func() error {
			count, err := f.createReviewImages(gctx, chunk)
			total.Add(count)
			return err
		})
	}

	if err := g.Wait(); err != nil {
		return 0, err
	}

	return total.Load(), nil
}

func (f *FakeReviewImages) createReviewImages(ctx context.Context, chunk []string) (int64, error) {
	batch := make([]db.BatchCreateReviewImageParams, 0)

	for _, id := range chunk {
		// Not all reviews should have media.
		// Skip reviews with a chance of 0.8.
		chance := gofakeit.Float32()

		if chance < 0.8 {
			continue
		}

		n, err := utils.SafeInt64ToInt16(int64(gofakeit.IntRange(0, 4)))

		if err != nil {
			return 0, err
		}

		for i := range n {
			batch = append(batch, db.BatchCreateReviewImageParams{
				ReviewID: id,
				Url:      getRandomImageUrl(),
				Index:    i + 1,
			})
		}
	}

	return f.db.Queries.BatchCreateReviewImage(ctx, batch)
}
