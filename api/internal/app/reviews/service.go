package reviews

import (
	"context"
	"errors"
	"strings"
	"wanderlust/internal/pkg/activities"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/dto"
	"wanderlust/internal/pkg/mapper"
	"wanderlust/internal/pkg/pagination"
	"wanderlust/internal/pkg/upload"
	"wanderlust/internal/pkg/utils"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
	"github.com/minio/minio-go/v7"
)

type Service struct {
	app *core.Application
}

func (s *Service) getMany(ids []string) ([]dto.Review, error) {
	dbReviews, err := s.app.Db.Queries.GetReviewsByIdsPopulated(context.Background(), ids)

	if err != nil {
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

func (s *Service) get(id string) (*dto.GetReviewByIdOutput, error) {
	review, err := s.getMany([]string{id})

	if err != nil {
		return nil, err
	}

	return &dto.GetReviewByIdOutput{
		Body: dto.GetReviewByIdOutputBody{
			Review: review[0],
		},
	}, nil
}

func (s *Service) create(userId string, body dto.CreateReviewInputBody) (*dto.CreateReviewOutput, error) {
	ctx := context.Background()
	tx, err := s.app.Db.Pool.Begin(ctx)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to create transaction")
	}

	defer tx.Rollback(ctx)

	qtx := s.app.Db.Queries.WithTx(tx)

	dbReview, err := qtx.CreateReview(ctx, db.CreateReviewParams{
		ID:      utils.GenerateId(s.app.Flake),
		PoiID:   body.PoiID,
		UserID:  userId,
		Content: body.Content,
		Rating:  body.Rating,
	})

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to create review")
	}

	err = qtx.IncrementTotalPoints(ctx, db.IncrementTotalPointsParams{
		ID:          body.PoiID,
		TotalPoints: int32(body.Rating),
	})

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to increment total points")
	}

	err = qtx.IncrementTotalVotes(ctx, body.PoiID)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to increment total votes")
	}

	err = tx.Commit(ctx)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to commit transaction")
	}

	getRes, err := s.get(dbReview.ID)

	if err != nil {
		return nil, err
	}

	r := getRes.Body.Review

	_ = s.app.Activities.Add(userId, activities.ActivityReview, activities.ReviewPayload{
		PoiName: r.Poi.Name,
		PoiId:   r.Poi.ID,
		Rating:  r.Rating,
	})

	return &dto.CreateReviewOutput{
		Body: dto.CreateReviewOutputBody{
			Review: r,
		},
	}, nil
}

func (s *Service) remove(userId string, id string) error {
	reviewRes, err := s.get(id)

	if err != nil {
		return err
	}

	r := reviewRes.Body.Review

	if r.UserID != userId {
		return huma.Error403Forbidden("You do not have permission to delete this review")
	}

	err = s.app.Db.Queries.DeleteReview(context.Background(), id)

	if err != nil {
		return huma.Error500InternalServerError("Failed to delete review")
	}

	for _, m := range r.Media {
		_, after, found := strings.Cut(m.Url, "reviews/")

		if !found {
			continue
		}

		err = s.app.Upload.Client.RemoveObject(
			context.Background(),
			string(upload.BUCKET_REVIEWS),
			after,
			minio.RemoveObjectOptions{},
		)

		if err != nil {
			s.app.Logger.Error("error deleting review media", s.app.Logger.Args("error", err))
		}
	}

	return nil
}

func (s *Service) getByUsername(username string, params dto.PaginationQueryParams) (*dto.GetReviewsByUsernameOutput, error) {
	dbRes, err := s.app.Db.Queries.GetReviewsByUsername(context.Background(), db.GetReviewsByUsernameParams{
		Username: username,
		Offset:   int32(pagination.GetOffset(params)),
		Limit:    int32(params.PageSize),
	})

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("Reviews not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get reviews")
	}

	ids := make([]string, len(dbRes))

	for i, v := range dbRes {
		ids[i] = v.Review.ID
	}

	reviews, err := s.getMany(ids)

	if err != nil {
		return nil, err
	}

	count, err := s.app.Db.Queries.CountReviewsByUsername(context.Background(), username)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to get reviews count")
	}

	return &dto.GetReviewsByUsernameOutput{
		Body: dto.GetReviewsByUsernameOutputBody{
			Reviews:    reviews,
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}

func (s *Service) getByPoiID(id string, params dto.PaginationQueryParams) (*dto.GetReviewsByPoiIdOutput, error) {
	dbRes, err := s.app.Db.Queries.GetReviewsByPoiId(context.Background(), db.GetReviewsByPoiIdParams{
		PoiID:  id,
		Offset: int32(pagination.GetOffset(params)),
		Limit:  int32(params.PageSize),
	})

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("Reviews not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get reviews")
	}

	ids := make([]string, len(dbRes))

	for i, v := range dbRes {
		ids[i] = v.Review.ID
	}

	reviews, err := s.getMany(ids)

	if err != nil {
		return nil, err
	}

	count, err := s.app.Db.Queries.CountReviewsByPoiId(context.Background(), id)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to get reviews count")
	}

	return &dto.GetReviewsByPoiIdOutput{
		Body: dto.GetReviewsByPoiIdOutputBody{
			Reviews:    reviews,
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}
