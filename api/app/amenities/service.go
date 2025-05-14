package amenities

import (
	"context"
	"errors"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
)

type Service struct {
	app *core.Application
}

func (s *Service) list(ctx context.Context) (*dto.ListAmenitiesOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.app.Db.Queries.GetAllAmenities(ctx)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("no amenities found")
		}

		return nil, huma.Error500InternalServerError("failed to get all amenities")
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

	res, err := s.app.Db.Queries.CreateAmenity(ctx, body.Name)

	if err != nil {
		if errors.Is(err, pgx.ErrTooManyRows) {
			return nil, huma.Error422UnprocessableEntity("amenity already exists")
		}

		return nil, huma.Error500InternalServerError("failed to create amenity")
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

	err := s.app.Db.Queries.UpdateAmenity(ctx, db.UpdateAmenityParams{
		ID:   id,
		Name: body.Name,
	})

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("amenity not found")
		}

		return nil, huma.Error500InternalServerError("failed to update amenity")
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

	err := s.app.Db.Queries.DeleteAmenity(ctx, id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return huma.Error404NotFound("amenity not found")
		}

		return huma.Error500InternalServerError("failed to delete amenity")
	}

	return nil
}
