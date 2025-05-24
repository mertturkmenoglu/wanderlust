package reviews

import (
	"context"
	"errors"
	"log/slog"
	"wanderlust/pkg/activities"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mapper"
	"wanderlust/pkg/pagination"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/upload"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Service struct {
	*core.Application
	db   *db.Queries
	pool *pgxpool.Pool
}

func (s *Service) findMany(ctx context.Context, ids []string) ([]dto.Review, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbReviews, err := s.db.GetReviewsByIdsPopulated(ctx, ids)

	if err != nil {
		sp.RecordError(err)
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("Reviews not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get reviews")
	}

	if len(dbReviews) != len(ids) {
		return nil, huma.Error404NotFound("One or more reviews not found")
	}

	reviews := make([]dto.Review, len(dbReviews))

	for i, dbReview := range dbReviews {
		reviews[i] = mapper.ToReview(dbReview)
	}

	return reviews, nil
}

func (s *Service) find(ctx context.Context, id string) (*dto.Review, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	reviews, err := s.findMany(ctx, []string{id})

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	if len(reviews) == 0 {
		err = huma.Error404NotFound("Review not found")
		sp.RecordError(err)
		return nil, err
	}

	return &reviews[0], nil
}

func (s *Service) get(ctx context.Context, id string) (*dto.GetReviewByIdOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	review, err := s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	return &dto.GetReviewByIdOutput{
		Body: dto.GetReviewByIdOutputBody{
			Review: *review,
		},
	}, nil
}

func (s *Service) create(ctx context.Context, body dto.CreateReviewInputBody) (*dto.CreateReviewOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tx, err := s.pool.Begin(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create transaction")
	}

	defer tx.Rollback(ctx)

	qtx := s.db.WithTx(tx)
	userId := ctx.Value("userId").(string)

	dbReview, err := qtx.CreateReview(ctx, db.CreateReviewParams{
		ID:      s.ID.Flake(),
		PoiID:   body.PoiID,
		UserID:  userId,
		Content: body.Content,
		Rating:  body.Rating,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create review")
	}

	err = qtx.IncrementTotalPoints(ctx, db.IncrementTotalPointsParams{
		ID:          body.PoiID,
		TotalPoints: int32(body.Rating),
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to increment total points")
	}

	err = qtx.IncrementTotalVotes(ctx, body.PoiID)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to increment total votes")
	}

	err = tx.Commit(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to commit transaction")
	}

	getRes, err := s.get(ctx, dbReview.ID)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	r := getRes.Body.Review

	err = s.Activities.Add(userId, activities.ActivityReview, activities.ReviewPayload{
		PoiName: r.Poi.Name,
		PoiId:   r.Poi.ID,
		Rating:  r.Rating,
	})

	if err != nil {
		tracing.Slog.Error("Failed to add create review activity", slog.Any("error", err))
	}

	return &dto.CreateReviewOutput{
		Body: dto.CreateReviewOutputBody{
			Review: r,
		},
	}, nil
}

func (s *Service) remove(ctx context.Context, id string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	review, err := s.find(ctx, id)

	if err != nil {
		return err
	}

	userId := ctx.Value("userId").(string)

	if !canRemoveReview(review, userId) {
		err = huma.Error403Forbidden("You do not have permission to delete this review")
		sp.RecordError(err)
		return err
	}

	err = s.db.DeleteReview(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("Failed to delete review")
	}

	for _, m := range review.Media {
		err = s.Upload.RemoveFileFromUrl(m.Url, upload.BUCKET_REVIEWS)

		if err != nil {
			tracing.Slog.Error("Failed to delete review media",
				slog.String("bucket", string(upload.BUCKET_REVIEWS)),
				slog.String("object", m.Url),
				slog.Any("error", err),
			)
			continue
		}
	}

	return nil
}

func (s *Service) getByUsername(ctx context.Context, username string, params dto.PaginationQueryParams) (*dto.GetReviewsByUsernameOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	ids, err := s.db.GetReviewIdsByUsername(ctx, db.GetReviewIdsByUsernameParams{
		Username: username,
		Offset:   int32(pagination.GetOffset(params)),
		Limit:    int32(params.PageSize),
	})

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("Reviews not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get reviews")
	}

	reviews, err := s.findMany(ctx, ids)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	count, err := s.db.CountReviewsByUsername(ctx, username)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get reviews count")
	}

	return &dto.GetReviewsByUsernameOutput{
		Body: dto.GetReviewsByUsernameOutputBody{
			Reviews:    reviews,
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}

func (s *Service) getByPoiID(ctx context.Context, id string, params dto.PaginationQueryParams) (*dto.GetReviewsByPoiIdOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	ids, err := s.db.GetReviewIdsByPoiId(ctx, db.GetReviewIdsByPoiIdParams{
		PoiID:  id,
		Offset: int32(pagination.GetOffset(params)),
		Limit:  int32(params.PageSize),
	})

	if err != nil {
		sp.RecordError(err)
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("Reviews not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get reviews")
	}

	reviews, err := s.findMany(ctx, ids)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	count, err := s.db.CountReviewsByPoiId(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get reviews count")
	}

	return &dto.GetReviewsByPoiIdOutput{
		Body: dto.GetReviewsByPoiIdOutputBody{
			Reviews:    reviews,
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}

func (s *Service) getRatings(ctx context.Context, id string) (*dto.GetRatingsByPoiIdOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbRes, err := s.db.GetPoiRatings(ctx, id)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("Reviews not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get reviews")
	}

	ratings := make(map[int8]int64)
	var totalVotes int64 = 0

	for i := range 5 {
		ratings[int8(i+1)] = 0
	}

	for _, v := range dbRes {
		ratings[int8(v.Rating)] = v.Count
		totalVotes += v.Count
	}

	return &dto.GetRatingsByPoiIdOutput{
		Body: dto.GetRatingsByPoiIdOutputBody{
			Ratings:    ratings,
			TotalVotes: totalVotes,
		},
	}, nil
}

func (s *Service) uploadMedia(ctx context.Context, id string, input dto.UploadReviewMediaInputBody) (*dto.UploadReviewMediaOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	review, err := s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	userId := ctx.Value("userId").(string)

	if !canUploadMedia(review, userId) {
		err = huma.Error403Forbidden("You do not have permission to upload media for this review")
		sp.RecordError(err)
		return nil, err
	}

	bucket := upload.BUCKET_REVIEWS

	// Check if the file is uploaded
	if !s.Upload.FileExists(bucket, input.FileName) {
		err = huma.Error400BadRequest("file not uploaded")
		sp.RecordError(err)
		return nil, err
	}

	// Check if user uploaded the correct file using cached information
	if !s.Cache.Has(cache.KeyBuilder(cache.KeyImageUpload, input.ID)) {
		err = huma.Error400BadRequest("incorrect file")
		sp.RecordError(err)
		return nil, err
	}

	// delete cached information
	err = s.Cache.Del(cache.KeyBuilder(cache.KeyImageUpload, userId, input.ID))

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to delete cached information")
	}

	lastOrder, err := s.db.GetLastMediaOrderOfReview(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get last media order")
	}

	ord, ok := lastOrder.(int32)

	if !ok {
		err = huma.Error500InternalServerError("Failed to cast last media order")
		sp.RecordError(err)
		return nil, err
	}

	order := int16(ord) + 1
	url := s.Upload.GetUrlForFile(bucket, input.FileName)

	_, err = s.db.CreateReviewMedia(ctx, db.CreateReviewMediaParams{
		ReviewID:   id,
		Url:        url,
		MediaOrder: order,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create review media")
	}

	review, err = s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	return &dto.UploadReviewMediaOutput{
		Body: dto.UploadReviewMediaOutputBody{
			Review: *review,
		},
	}, nil
}
