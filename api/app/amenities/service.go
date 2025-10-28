package amenities

import (
	"context"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/tracing"
)

type Service struct {
	repo *Repository
}

func (s *Service) list(ctx context.Context) (*dto.ListAmenitiesOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.repo.list(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	amenities := make([]dto.Amenity, len(res))

	for i, amenity := range res {
		amenities[i] = dto.Amenity{
			ID:   amenity.ID,
			Name: amenity.Name,
		}
	}

	return &dto.ListAmenitiesOutput{
		Body: dto.ListAmenitiesOutputBody{
			Amenities: amenities,
		},
	}, nil
}

func (s *Service) create(ctx context.Context, body dto.CreateAmenityInputBody) (*dto.CreateAmenityOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.repo.create(ctx, body.Name)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	return &dto.CreateAmenityOutput{
		Body: dto.CreateAmenityOutputBody{
			Amenity: dto.Amenity{
				ID:   res.ID,
				Name: res.Name,
			},
		},
	}, nil

}

func (s *Service) update(ctx context.Context, id int32, body dto.UpdateAmenityInputBody) (*dto.UpdateAmenityOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	err := s.repo.update(ctx, UpdateParams{
		ID:   id,
		Name: body.Name,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	return &dto.UpdateAmenityOutput{
		Body: dto.UpdateAmenityOutputBody{
			Amenity: dto.Amenity{
				ID:   id,
				Name: body.Name,
			},
		},
	}, nil
}

func (s *Service) remove(ctx context.Context, id int32) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	return s.repo.remove(ctx, id)
}
