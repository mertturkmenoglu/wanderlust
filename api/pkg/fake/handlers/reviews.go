package handlers

import (
	"cmp"
	"context"
	"fmt"
	"slices"
	"sync/atomic"
	"wanderlust/pkg/db"
	"wanderlust/pkg/fake/fakeutils"
	"wanderlust/pkg/utils"

	"github.com/brianvoe/gofakeit/v7"
	"github.com/jackc/pgx/v5/pgtype"
	"golang.org/x/sync/errgroup"
)

type FakeReviews struct {
	PlacesPath string
	UsersPath  string
	*Fake
}

func (f *FakeReviews) Generate() (int64, error) {
	placeIds, userIds, err := f.readFiles()

	if err != nil {
		return 0, err
	}

	var total atomic.Int64
	g, gctx := errgroup.WithContext(context.Background())
	g.SetLimit(10)

	for chunk := range slices.Chunk(placeIds, 100) {
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

	for chunk := range slices.Chunk(placeIds, 100) {
		g.Go(func() error {
			err := f.updatePlaceRateAndVotes(gctx, chunk)
			return err
		})
	}

	if err := g.Wait(); err != nil {
		return 0, err
	}

	return total.Load(), nil
}

func (f *FakeReviews) readFiles() ([]string, []string, error) {
	placeIds, err := fakeutils.ReadFile(f.PlacesPath)

	if err != nil {
		return nil, nil, err
	}

	userIds, err := fakeutils.ReadFile(f.UsersPath)

	if err != nil {
		return nil, nil, err
	}

	return placeIds, userIds, nil
}

func (f *FakeReviews) createReviews(ctx context.Context, placeIds []string, userIds []string) (int64, error) {
	batch := make([]db.BatchCreateReviewsParams, 0)

	for _, placeId := range placeIds {
		n := gofakeit.IntRange(1, 40)

		for range n {
			userId := fakeutils.RandElem(userIds)
			rating, err := utils.SafeInt64ToInt16(int64(gofakeit.IntRange(1, 5)))

			if err != nil {
				return 0, err
			}

			batch = append(batch, db.BatchCreateReviewsParams{
				ID:      gofakeit.UUID(),
				PlaceID: placeId,
				UserID:  userId,
				Content: gofakeit.Paragraph(2, 4, 5, " "),
				Rating:  rating,
			})
		}
	}

	return f.db.Queries.BatchCreateReviews(ctx, batch)
}

func (f *FakeReviews) updatePlaceRateAndVotes(ctx context.Context, placeIds []string) error {
	tx, err := f.db.Pool.Begin(ctx)

	if err != nil {
		return err
	}

	defer tx.Rollback(ctx)

	qtx := f.db.Queries.WithTx(tx)

	for _, placeId := range placeIds {
		count, err1 := qtx.CountReviewsByPlaceId(ctx, placeId)
		totalRating, err2 := qtx.FindPlaceTotalRating(ctx, placeId)

		if err := cmp.Or(err1, err2); err != nil {
			return err
		}

		cast, ok := totalRating.(int64)

		if !ok {
			return fmt.Errorf("invalid type: %T", totalRating)
		}

		votesInt32, err1 := utils.SafeInt64ToInt32(count)
		pointsInt32, err2 := utils.SafeInt64ToInt32(cast)

		if err := cmp.Or(err1, err2); err != nil {
			return err
		}

		_, err = qtx.UpdatePlaceRatingsAndVotes(ctx, db.UpdatePlaceRatingsAndVotesParams{
			ID:          placeId,
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
			count, err := f.createReviewAssets(gctx, chunk)
			total.Add(count)
			return err
		})
	}

	if err := g.Wait(); err != nil {
		return 0, err
	}

	return total.Load(), nil
}

func (f *FakeReviewImages) createReviewAssets(ctx context.Context, chunk []string) (int64, error) {
	batch := make([]db.BatchCreateReviewAssetsParams, 0)

	for _, id := range chunk {
		// Not all reviews should have media.
		// Skip reviews with a chance of 0.8.
		chance := gofakeit.Float32()

		if chance < 0.8 {
			continue
		}

		n := fakeutils.RandInt16Range(0, 4)

		for i := range n {
			batch = append(batch, db.BatchCreateReviewAssetsParams{
				EntityType:  "review",
				EntityID:    id,
				AssetType:   "image",
				Description: pgtype.Text{},
				Order:       int32(i + 1),
				Url:         getRandomImageUrl(),
			})
		}
	}

	return f.db.Queries.BatchCreateReviewAssets(ctx, batch)
}
