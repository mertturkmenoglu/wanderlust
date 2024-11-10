package reviews

import (
	"context"
	"errors"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/utils"

	"github.com/jackc/pgx/v5"
)

func (r *repository) createReview(userId string, dto CreateReviewRequestDto) (db.Review, error) {
	ctx := context.Background()
	tx, err := r.di.Db.Pool.Begin(ctx)

	if err != nil {
		return db.Review{}, err
	}

	defer tx.Rollback(ctx)

	qtx := r.di.Db.Queries.WithTx(tx)

	lastReview, err := qtx.LastReviewOfUserForPoi(ctx, db.LastReviewOfUserForPoiParams{
		PoiID:  dto.PoiID,
		UserID: userId,
	})

	isFirstReview := err != nil && errors.Is(err, pgx.ErrNoRows)

	review, err := qtx.CreateReview(ctx, db.CreateReviewParams{
		ID:      utils.GenerateId(r.di.Flake),
		PoiID:   dto.PoiID,
		UserID:  userId,
		Content: dto.Content,
		Rating:  dto.Rating,
	})

	if err != nil {
		return db.Review{}, err
	}

	if isFirstReview {
		err = qtx.IncrementTotalVotes(ctx, dto.PoiID)

		if err != nil {
			return db.Review{}, err
		}
	}

	var diff int32 = 0
	if !isFirstReview {
		diff = int32(dto.Rating) - int32(lastReview.Rating)
	} else {
		diff = int32(dto.Rating)
	}

	err = qtx.IncrementTotalPoints(ctx, db.IncrementTotalPointsParams{
		ID:          dto.PoiID,
		TotalPoints: diff,
	})

	if err != nil {
		return db.Review{}, err
	}

	err = qtx.SetPreviousReviewRatings(ctx, db.SetPreviousReviewRatingsParams{
		UserID: userId,
		Rating: dto.Rating,
		PoiID:  dto.PoiID,
	})

	if err != nil {
		return db.Review{}, err
	}

	err = tx.Commit(ctx)

	if err != nil {
		return db.Review{}, err
	}

	return review, nil
}

func (r *repository) getReviewById(id string) (db.GetReviewByIdRow, error) {
	return r.di.Db.Queries.GetReviewById(context.Background(), id)
}

func (r *repository) getReviewMedia(id string) ([]db.ReviewMedium, error) {
	return r.di.Db.Queries.GetReviewMedia(context.Background(), id)
}
