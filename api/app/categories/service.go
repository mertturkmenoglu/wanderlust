package categories

import (
	"context"
	"errors"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Service struct {
	*core.Application
	db   *db.Queries
	pool *pgxpool.Pool
}

func (s *Service) list(ctx context.Context) (*dto.ListCategoriesOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.db.GetCategories(ctx)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("No categories found")
		}

		return nil, huma.Error500InternalServerError("Failed to get all categories")
	}

	categories := make([]dto.Category, len(res))

	for i, category := range res {
		categories[i] = dto.Category{
			ID:    category.ID,
			Name:  category.Name,
			Image: category.Image,
		}
	}

	return &dto.ListCategoriesOutput{
		Body: dto.ListCategoriesOutputBody{
			Categories: categories,
		},
	}, nil
}

func (s *Service) create(ctx context.Context, body dto.CreateCategoryInputBody) (*dto.CreateCategoryOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.db.CreateCategory(ctx, db.CreateCategoryParams{
		ID:    body.ID,
		Name:  body.Name,
		Image: body.Image,
	})

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrTooManyRows) {
			return nil, huma.Error422UnprocessableEntity("Category already exists")
		}

		return nil, huma.Error500InternalServerError("Failed to create category")
	}

	return &dto.CreateCategoryOutput{
		Body: dto.CreateCategoryOutputBody{
			Category: dto.Category{
				ID:    res.ID,
				Name:  res.Name,
				Image: res.Image,
			},
		},
	}, nil

}

func (s *Service) update(ctx context.Context, id int16, body dto.UpdateCategoryInputBody) (*dto.UpdateCategoryOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbCategory, err := s.db.UpdateCategory(ctx, db.UpdateCategoryParams{
		ID:    id,
		Name:  body.Name,
		Image: body.Image,
	})

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("Category not found")
		}

		return nil, huma.Error500InternalServerError("Failed to update category")
	}

	return &dto.UpdateCategoryOutput{
		Body: dto.UpdateCategoryOutputBody{
			Category: dto.Category{
				ID:    dbCategory.ID,
				Name:  dbCategory.Name,
				Image: dbCategory.Image,
			},
		},
	}, nil
}

func (s *Service) remove(ctx context.Context, id int16) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	err := s.db.DeleteCategory(ctx, id)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return huma.Error404NotFound("Category not found")
		}

		return huma.Error500InternalServerError("Failed to delete category")
	}

	return nil
}
