package reviews

import (
	"context"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/pagination"
	"wanderlust/internal/pkg/utils"
)

func (r *repository) createReview(userId string, dto CreateReviewRequestDto) (db.Review, error) {
	ctx := context.Background()
	tx, err := r.di.Db.Pool.Begin(ctx)

	if err != nil {
		return db.Review{}, err
	}

	defer tx.Rollback(ctx)

	qtx := r.di.Db.Queries.WithTx(tx)

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

	err = qtx.IncrementTotalPoints(ctx, db.IncrementTotalPointsParams{
		ID:          dto.PoiID,
		TotalPoints: int32(dto.Rating),
	})

	if err != nil {
		return db.Review{}, err
	}

	err = qtx.IncrementTotalVotes(ctx, dto.PoiID)

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

func (r *repository) deleteReview(id string) error {
	return r.di.Db.Queries.DeleteReview(context.Background(), id)
}

func (r *repository) getReviewsByPoiId(id string, params pagination.Params) ([]db.GetReviewsByPoiIdRow, error) {
	return r.di.Db.Queries.GetReviewsByPoiId(context.Background(), db.GetReviewsByPoiIdParams{
		PoiID:  id,
		Offset: int32(params.Offset),
		Limit:  int32(params.PageSize),
	})
}

func (r *repository) countReviewsByPoiId(id string) (int64, error) {
	return r.di.Db.Queries.CountReviewsByPoiId(context.Background(), id)
}

func (r *repository) getReviewMediaByReviewIds(ids []string) ([]db.ReviewMedium, error) {
	return r.di.Db.Queries.GetReviewMediaByReviewIds(context.Background(), ids)
}

func (r *repository) addMedia(id string, url string) error {
	lastMediaOrder, err := r.di.Db.Queries.GetLastMediaOrderOfReview(context.Background(), id)

	if err != nil {
		return err
	}

	ord, ok := lastMediaOrder.(int32)

	if !ok {
		return ErrMediaOrder
	}

	order := int16(ord) + 1

	_, err = r.di.Db.Queries.CreateReviewMedia(context.Background(), db.CreateReviewMediaParams{
		ReviewID:   id,
		Url:        url,
		MediaOrder: order,
	})

	return err
}

func (r *repository) getReviewsByUsername(username string, params pagination.Params) ([]db.GetReviewsByUsernameRow, error) {
	return r.di.Db.Queries.GetReviewsByUsername(context.Background(), db.GetReviewsByUsernameParams{
		Username: username,
		Offset:   int32(params.Offset),
		Limit:    int32(params.PageSize),
	})
}

func (r *repository) countReviewsByUsername(username string) (int64, error) {
	return r.di.Db.Queries.CountReviewsByUsername(context.Background(), username)
}
