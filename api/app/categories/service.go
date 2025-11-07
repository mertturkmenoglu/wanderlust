package categories

import (
	"context"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/tracing"
)

type Service struct {
	repo *Repository
}

func (s *Service) list(ctx context.Context) (*ListCategoriesOutput, error) {
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

	return &ListCategoriesOutput{
		Body: ListCategoriesOutputBody{
			Categories: categories,
		},
	}, nil
}

func (s *Service) create(ctx context.Context, body CreateCategoryInputBody) (*CreateCategoryOutput, error) {
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

	return &CreateCategoryOutput{
		Body: CreateCategoryOutputBody{
			Category: dto.ToCategory(*res),
		},
	}, nil

}

func (s *Service) update(ctx context.Context, id int16, body UpdateCategoryInputBody) (*UpdateCategoryOutput, error) {
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

	return &UpdateCategoryOutput{
		Body: UpdateCategoryOutputBody{
			Category: dto.ToCategory(*res),
		},
	}, nil
}

func (s *Service) remove(ctx context.Context, id int16) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	return s.repo.remove(ctx, id)
}
