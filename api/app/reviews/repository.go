package reviews

import (
	"context"
	"wanderlust/app/places"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/pagination"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/utils"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/pkg/errors"
)

type Repository struct {
	db            *db.Queries
	pool          *pgxpool.Pool
	placesService *places.Service
}

func (r *Repository) list(ctx context.Context, ids []string) ([]dto.Review, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbReviews, err := r.db.FindManyReviewsById(ctx, ids)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToList, err.Error())
	}

	if len(dbReviews) != len(ids) {
		return nil, ErrNotFound
	}

	placeIds := make([]string, len(dbReviews))

	for i, v := range dbReviews {
		placeIds[i] = v.Review.PlaceID
	}

	places, err := r.placesService.FindMany(ctx, placeIds)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToList, err.Error())
	}

	reviews, err := dto.ToReviews(dbReviews, places)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToList, err.Error())
	}

	return reviews, nil
}

func (r *Repository) get(ctx context.Context, id string) (*dto.Review, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	rev, err := r.list(ctx, []string{id})

	if err != nil {
		return nil, err
	}

	if len(rev) == 0 {
		return nil, ErrNotFound
	}

	return &rev[0], nil
}

type CreateParams = db.CreateReviewParams

func (r *Repository) create(ctx context.Context, params CreateParams) (*db.Review, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tx, err := r.pool.Begin(ctx)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToCreate, err.Error())
	}

	defer tx.Rollback(ctx)

	qtx := r.db.WithTx(tx)

	rev, err := qtx.CreateReview(ctx, params)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToCreate, err.Error())
	}

	_, err = qtx.IncrementPlaceTotalPoints(ctx, db.IncrementPlaceTotalPointsParams{
		ID:          params.PlaceID,
		TotalPoints: int32(params.Rating),
	})

	if err != nil {
		return nil, errors.Wrap(ErrFailedToCreate, err.Error())
	}

	_, err = qtx.IncrementPlaceTotalVotes(ctx, params.PlaceID)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToCreate, err.Error())
	}

	err = tx.Commit(ctx)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToCreate, err.Error())
	}

	return &rev, nil
}

func (r *Repository) remove(ctx context.Context, id string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tag, err := r.db.RemoveReview(ctx, id)

	if err != nil {
		return errors.Wrap(ErrFailedToDelete, err.Error())
	}

	if tag.RowsAffected() == 0 {
		return ErrNotFound
	}

	return nil
}

func (r *Repository) listByUsername(ctx context.Context, username string, params dto.PaginationQueryParams) ([]dto.Review, int64, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	ids, err := r.db.FindManyReviewIdsByUsername(ctx, db.FindManyReviewIdsByUsernameParams{
		Username: username,
		Offset:   int32(pagination.GetOffset(params)),
		Limit:    int32(params.PageSize),
	})

	if err != nil {
		return nil, 0, errors.Wrap(ErrFailedToList, err.Error())
	}

	reviews, err := r.list(ctx, ids)

	if err != nil {
		return nil, 0, err
	}

	count, err := r.db.CountReviewsByUsername(ctx, username)

	if err != nil {
		return nil, 0, errors.Wrap(ErrFailedToList, err.Error())
	}

	return reviews, count, nil
}

type ListByPlaceIdParams = db.FindManyReviewIdsByPlaceIdAndRatingParams

func (r *Repository) listByPlaceId(ctx context.Context, params ListByPlaceIdParams) ([]dto.Review, int64, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.FindManyReviewIdsByPlaceIdAndRating(ctx, params)

	if err != nil {
		return nil, 0, errors.Wrap(ErrFailedToList, err.Error())
	}

	reviews, err := r.list(ctx, res)

	if err != nil {
		return nil, 0, err
	}

	count, err := r.db.CountReviewsByPlaceIdAndRating(ctx, db.CountReviewsByPlaceIdAndRatingParams{
		Placeid:   params.Placeid,
		Minrating: params.Minrating,
		Maxrating: params.Maxrating,
	})

	if err != nil {
		return nil, 0, errors.Wrap(ErrFailedToList, err.Error())
	}

	return reviews, count, nil
}

func (r *Repository) getRatings(ctx context.Context, placeId string) (map[int8]int64, int64, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.FindPlaceRatings(ctx, placeId)

	if err != nil {
		return nil, 0, errors.Wrap(ErrFailedToGetRatings, err.Error())
	}

	ratings := make(map[int8]int64)
	var totalVotes int64 = 0

	var i int8

	for i = range 5 {
		ratings[i+1] = 0
	}

	for _, v := range res {
		ratings[int8(v.Rating)] = v.Count
		totalVotes += v.Count
	}

	return ratings, totalVotes, nil
}

func (r *Repository) listAssets(ctx context.Context, placeId string) ([]dto.Asset, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.FindManyReviewAssetsByPlaceId(ctx, placeId)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToList, err.Error())
	}

	assets := make([]dto.Asset, len(res))

	for i, v := range res {
		assets[i] = dto.Asset{
			ID:          v.ID,
			EntityType:  v.EntityType,
			EntityID:    v.EntityID,
			Url:         v.Url,
			AssetType:   v.AssetType,
			Description: utils.TextToStr(v.Description),
			CreatedAt:   v.CreatedAt.Time,
			UpdatedAt:   v.UpdatedAt.Time,
			Order:       v.Order,
		}
	}

	return assets, nil
}

func (r *Repository) getLastReviewAssetIndex(ctx context.Context, reviewId string) (int32, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	index, err := r.db.FindReviewLastAssetIndex(ctx, reviewId)

	if err != nil {
		return 0, errors.Wrap(ErrFailedToUpload, err.Error())
	}

	ord, ok := index.(int32)

	if !ok {
		return 0, errors.Wrap(ErrFailedToUpload, "failed to convert index to int32")
	}

	return ord, nil
}

type CreateReviewAssetParams = db.CreateReviewAssetParams

func (r *Repository) createReviewAsset(ctx context.Context, params CreateReviewAssetParams) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	_, err := r.db.CreateReviewAsset(ctx, params)

	if err != nil {
		return errors.Wrap(ErrFailedToUpload, err.Error())
	}

	return nil
}
