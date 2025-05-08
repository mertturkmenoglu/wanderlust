package reviews

import (
	"context"
	"errors"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/dto"
	"wanderlust/internal/pkg/mapper"

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
