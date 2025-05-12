package categories

import (
	"context"
	"errors"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
)

type Service struct {
	app *core.Application
}

func (s *Service) list() (*dto.ListCategoriesOutput, error) {
	res, err := s.app.Db.Queries.GetCategories(context.Background())

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("no categories found")
		}

		return nil, huma.Error500InternalServerError("failed to get all categories")
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

func (s *Service) create(body dto.CreateCategoryInputBody) (*dto.CreateCategoryOutput, error) {
	res, err := s.app.Db.Queries.CreateCategory(context.Background(), db.CreateCategoryParams{
		ID:    body.ID,
		Name:  body.Name,
		Image: body.Image,
	})

	if err != nil {
		if errors.Is(err, pgx.ErrTooManyRows) {
			return nil, huma.Error422UnprocessableEntity("category already exists")
		}

		return nil, huma.Error500InternalServerError("failed to create category")
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

func (s *Service) update(id int16, body dto.UpdateCategoryInputBody) (*dto.UpdateCategoryOutput, error) {
	dbCategory, err := s.app.Db.Queries.UpdateCategory(context.Background(), db.UpdateCategoryParams{
		ID:    id,
		Name:  body.Name,
		Image: body.Image,
	})

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("category not found")
		}

		return nil, huma.Error500InternalServerError("failed to update category")
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

func (s *Service) remove(id int16) error {
	err := s.app.Db.Queries.DeleteCategory(context.Background(), id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return huma.Error404NotFound("category not found")
		}

		return huma.Error500InternalServerError("failed to delete category")
	}

	return nil
}
