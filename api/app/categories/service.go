package categories

import (
	"context"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/tracing"
)

type Service struct {
	repo *Repository
}

func (s *Service) list(ctx context.Context) (*dto.ListCategoriesOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.repo.list(ctx)

	if err != nil {
		return nil, err
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

	res, err := s.repo.create(ctx, CreateParams{
		ID:    body.ID,
		Name:  body.Name,
		Image: body.Image,
	})

	if err != nil {
		return nil, err
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

	res, err := s.repo.update(ctx, UpdateParams{
		ID:    id,
		Name:  body.Name,
		Image: body.Image,
	})

	if err != nil {
		return nil, err
	}

	return &dto.UpdateCategoryOutput{
		Body: dto.UpdateCategoryOutputBody{
			Category: dto.Category{
				ID:    res.ID,
				Name:  res.Name,
				Image: res.Image,
			},
		},
	}, nil
}

func (s *Service) remove(ctx context.Context, id int16) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	return s.repo.remove(ctx, id)
}
