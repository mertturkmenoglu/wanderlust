package reviews

import (
	"context"
	"errors"
	"log/slog"
	"wanderlust/app/pois"
	"wanderlust/pkg/activities"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mapper"
	"wanderlust/pkg/pagination"
	"wanderlust/pkg/storage"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/utils"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Service struct {
	*core.Application
	poiService *pois.Service
	db         *db.Queries
	pool       *pgxpool.Pool
}

func (s *Service) findMany(ctx context.Context, ids []string) ([]dto.Review, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbReviews, err := s.db.GetReviewsByIds(ctx, ids)

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

	poiIds := make([]string, 0)

	for _, v := range dbReviews {
		poiIds = append(poiIds, v.Review.PoiID)
	}

	pois, err := s.poiService.FindMany(ctx, poiIds)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	reviews, err := mapper.ToReviews(dbReviews, pois)

	if err != nil {
		sp.RecordError(err)
		return nil, err
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

	err = s.Activities.Add(ctx, activities.Activity{
		UserID: userId,
		Type:   activities.ActivityReview,
		Payload: activities.ReviewPayload{
			PoiName: r.Poi.Name,
			PoiId:   r.Poi.ID,
			Rating:  r.Rating,
		},
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

	for _, m := range review.Images {
		filename := storage.GetFilename(ctx, m.Url)
		bucket, err := storage.OpenBucket(ctx, storage.BUCKET_REVIEWS)

		if err != nil {
			tracing.Slog.Error("Failed to open review images bucket",
				slog.String("bucket", string(storage.BUCKET_REVIEWS)),
				slog.String("object", m.Url),
				slog.Any("error", err),
			)
			continue
		}

		err = bucket.Delete(ctx, filename)

		if err != nil {
			tracing.Slog.Error("Failed to delete review image",
				slog.String("bucket", string(storage.BUCKET_REVIEWS)),
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

func (s *Service) getByPoiID(ctx context.Context, input *dto.GetReviewsByPoiIdInput) (*dto.GetReviewsByPoiIdOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	var minRating int16 = 0
	var maxRating int16 = 5
	var sortBy = "created_at"
	var sortOrd = "desc"

	if input.MinRating != 0 {
		minRating = input.MinRating
	}

	if input.MaxRating != 0 {
		maxRating = input.MaxRating
	}

	if input.SortBy == "rating" {
		sortBy = "rating"
	}

	if input.SortOrd == "asc" {
		sortOrd = "asc"
	}

	ids, err := s.db.GetReviewIdsByPoiIdFiltered(ctx, db.GetReviewIdsByPoiIdFilteredParams{
		Poiid:     input.ID,
		Minrating: minRating,
		Maxrating: maxRating,
		Sortby:    sortBy,
		Sortord:   sortOrd,
		Offset:    int32(pagination.GetOffset(input.PaginationQueryParams)),
		Limit:     int32(input.PaginationQueryParams.PageSize),
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

	count, err := s.db.CountReviewsByPoiIdFiltered(ctx, db.CountReviewsByPoiIdFilteredParams{
		Poiid:     input.ID,
		Minrating: minRating,
		Maxrating: maxRating,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get reviews count")
	}

	return &dto.GetReviewsByPoiIdOutput{
		Body: dto.GetReviewsByPoiIdOutputBody{
			Reviews:    reviews,
			Pagination: pagination.Compute(input.PaginationQueryParams, count),
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

	var i int8

	for i = range 5 {
		ratings[i+1] = 0
	}

	for _, v := range dbRes {
		cast, err := utils.SafeInt16ToInt8(v.Rating)

		if err != nil {
			return nil, huma.Error500InternalServerError("Internal server error")
		}

		ratings[cast] = v.Count
		totalVotes += v.Count
	}

	return &dto.GetRatingsByPoiIdOutput{
		Body: dto.GetRatingsByPoiIdOutputBody{
			Ratings:    ratings,
			TotalVotes: totalVotes,
		},
	}, nil
}

func (s *Service) getImages(ctx context.Context, id string) (*dto.GetReviewImagesByPoiIdOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbRes, err := s.db.GetReviewImagesByPoiId(ctx, id)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("Reviews not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get reviews")
	}

	images := make([]dto.ReviewImage, len(dbRes))

	for i, v := range dbRes {
		images[i] = dto.ReviewImage{
			ID:       v.ID,
			ReviewID: v.ReviewID,
			Url:      v.Url,
			Index:    v.Index,
		}
	}

	return &dto.GetReviewImagesByPoiIdOutput{
		Body: dto.GetReviewImagesByPoiIdOutputBody{
			Images: images,
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

	bucket, err := storage.OpenBucket(ctx, storage.BUCKET_REVIEWS)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to open review images bucket")
	}

	// Check if the file is uploaded
	ok, err := bucket.Exists(ctx, input.FileName)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to check if file exists")
	}

	if !ok {
		err = huma.Error400BadRequest("file not uploaded")
		sp.RecordError(err)
		return nil, err
	}

	// Check if user uploaded the correct file using cached information
	if !s.Cache.Has(ctx, cache.KeyBuilder(cache.KeyImageUpload, input.ID)) {
		err = huma.Error400BadRequest("incorrect file")
		sp.RecordError(err)
		return nil, err
	}

	// delete cached information
	err = s.Cache.Del(ctx, cache.KeyBuilder(cache.KeyImageUpload, userId, input.ID)).Err()

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to delete cached information")
	}

	lastOrder, err := s.db.GetLastReviewImageIndex(ctx, id)

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

	ordInt16, err := utils.SafeInt32ToInt16(ord)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Internal server error")
	}

	order := ordInt16 + 1
	url, err := storage.GetUrl(ctx, storage.BUCKET_REVIEWS, input.FileName)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get file url")
	}

	_, err = s.db.BatchCreateReviewImage(ctx, []db.BatchCreateReviewImageParams{
		{
			ReviewID: id,
			Url:      url,
			Index:    order,
		},
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
