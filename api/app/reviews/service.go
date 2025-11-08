package reviews

import (
	"context"
	"log/slog"
	"wanderlust/app/places"
	"wanderlust/pkg/activities"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/pagination"
	"wanderlust/pkg/storage"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/uid"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/pkg/errors"
)

type Service struct {
	placesService *places.Service
	repo          *Repository
	cache         *cache.Cache
	activities    *activities.ActivityService
}

func (s *Service) get(ctx context.Context, id string) (*GetReviewByIdOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	review, err := s.repo.get(ctx, id)

	if err != nil {
		return nil, err
	}

	return &GetReviewByIdOutput{
		Body: GetReviewByIdOutputBody{
			Review: *review,
		},
	}, nil
}

func (s *Service) create(ctx context.Context, body CreateReviewInputBody) (*CreateReviewOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	dbReview, err := s.repo.create(ctx, CreateParams{
		ID:      uid.Flake(),
		PlaceID: body.PlaceID,
		UserID:  userId,
		Content: body.Content,
		Rating:  body.Rating,
	})

	if err != nil {
		return nil, err
	}

	review, err := s.repo.get(ctx, dbReview.ID)

	if err != nil {
		return nil, err
	}

	err = s.activities.Add(ctx, activities.Activity{
		UserID: userId,
		Type:   activities.ActivityReview,
		Payload: activities.ReviewPayload{
			PlaceName: review.Place.Name,
			PlaceID:   review.Place.ID,
			Rating:    review.Rating,
		},
	})

	if err != nil {
		tracing.Slog.Error("Failed to add create review activity", slog.Any("error", err))
	}

	return &CreateReviewOutput{
		Body: CreateReviewOutputBody{
			Review: *review,
		},
	}, nil
}

func (s *Service) remove(ctx context.Context, id string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)
	review, err := s.repo.get(ctx, id)

	if err != nil {
		return err
	}

	if !canRemoveReview(review, userId) {
		return ErrNotAuthorizedToDelete
	}

	err = s.repo.remove(ctx, id)

	if err != nil {
		return err
	}

	for _, asset := range review.Assets {
		filename := storage.GetFilename(ctx, asset.Url)
		bucket, err := storage.OpenBucket(ctx, storage.BUCKET_REVIEWS)

		if err != nil {
			tracing.Slog.Error("Failed to open review reviews bucket",
				slog.String("bucket", string(storage.BUCKET_REVIEWS)),
				slog.String("object", asset.Url),
				slog.Any("error", err),
			)
			continue
		}

		defer bucket.Close()

		err = bucket.Delete(ctx, filename)

		if err != nil {
			tracing.Slog.Error("Failed to delete review asset",
				slog.String("bucket", string(storage.BUCKET_REVIEWS)),
				slog.String("object", asset.Url),
				slog.Any("error", err),
			)
			continue
		}
	}

	return nil
}

func (s *Service) getByUsername(ctx context.Context, username string, params dto.PaginationQueryParams) (*GetReviewsByUsernameOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	reviews, count, err := s.repo.listByUsername(ctx, username, params)

	if err != nil {
		return nil, err
	}

	return &GetReviewsByUsernameOutput{
		Body: GetReviewsByUsernameOutputBody{
			Reviews:    reviews,
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}

func (s *Service) getByPlaceId(ctx context.Context, input *GetReviewsByPlaceIdInput) (*GetReviewsByPlaceIdOutput, error) {
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

	reviews, count, err := s.repo.listByPlaceId(ctx, ListByPlaceIdParams{
		Placeid:   input.ID,
		Minrating: minRating,
		Maxrating: maxRating,
		Sortby:    sortBy,
		Sortord:   sortOrd,
		Offset:    int32(pagination.GetOffset(input.PaginationQueryParams)),
		Limit:     int32(input.PaginationQueryParams.PageSize),
	})

	if err != nil {
		return nil, err
	}

	return &GetReviewsByPlaceIdOutput{
		Body: GetReviewsByPlaceIdOutputBody{
			Reviews:    reviews,
			Pagination: pagination.Compute(input.PaginationQueryParams, count),
		},
	}, nil
}

func (s *Service) getRatings(ctx context.Context, id string) (*GetRatingsByPlaceIdOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	ratings, totalVotes, err := s.repo.getRatings(ctx, id)

	if err != nil {
		return nil, err
	}

	return &GetRatingsByPlaceIdOutput{
		Body: GetRatingsByPlaceIdOutputBody{
			Ratings:    ratings,
			TotalVotes: totalVotes,
		},
	}, nil
}

func (s *Service) getAssets(ctx context.Context, id string) (*GetReviewAssetsByPlaceIdOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	assets, err := s.repo.listAssets(ctx, id)

	if err != nil {
		return nil, err
	}

	return &GetReviewAssetsByPlaceIdOutput{
		Body: GetReviewAssetsByPlaceIdOutputBody{
			Assets: assets,
		},
	}, nil
}

func (s *Service) uploadAsset(ctx context.Context, id string, input UploadReviewAssetInputBody) (*UploadReviewAssetOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	review, err := s.repo.get(ctx, id)

	if err != nil {
		return nil, err
	}

	if !canUploadMedia(review, userId) {
		return nil, ErrNotAuthorizedToUpload
	}

	bucket, err := storage.OpenBucket(ctx, storage.BUCKET_REVIEWS)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToUpload, err.Error())
	}

	defer bucket.Close()

	// Check if the file is uploaded
	ok, err := bucket.Exists(ctx, input.FileName)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToUpload, err.Error())
	}

	if !ok {
		return nil, ErrFileNotUploaded
	}

	// Check if user uploaded the correct file using cached information
	if !s.cache.Has(ctx, cache.KeyBuilder(cache.KeyImageUpload, input.ID)) {
		return nil, ErrIncorrectFile
	}

	// delete cached information
	err = s.cache.Del(ctx, cache.KeyBuilder(cache.KeyImageUpload, userId, input.ID)).Err()

	if err != nil {
		return nil, errors.Wrap(ErrFailedToUpload, err.Error())
	}

	lastOrder, err := s.repo.getLastReviewAssetIndex(ctx, id)

	if err != nil {
		return nil, err
	}

	order := lastOrder + 1

	url, err := storage.GetUrl(ctx, storage.BUCKET_REVIEWS, input.FileName)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToUpload, err.Error())
	}

	err = s.repo.createReviewAsset(ctx, CreateReviewAssetParams{
		EntityID:    id,
		Url:         url,
		AssetType:   "image",
		Description: pgtype.Text{},
		Order:       order,
	})

	if err != nil {
		return nil, errors.Wrap(ErrFailedToUpload, err.Error())
	}

	review, err = s.repo.get(ctx, id)

	if err != nil {
		return nil, err
	}

	return &UploadReviewAssetOutput{
		Body: UploadReviewAssetOutputBody{
			Review: *review,
		},
	}, nil
}
