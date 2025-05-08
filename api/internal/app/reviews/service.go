package reviews

import (
	"context"
	"errors"
	"wanderlust/internal/pkg/activities"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/dto"
	"wanderlust/internal/pkg/mapper"
	"wanderlust/internal/pkg/utils"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
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
