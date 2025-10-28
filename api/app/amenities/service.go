package amenities

import (
	"context"
	"errors"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/tracing"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Service struct {
	*core.Application
	db   *db.Queries
	pool *pgxpool.Pool
}

func (s *Service) list(ctx context.Context) (*dto.ListAmenitiesOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.db.GetAllAmenities(ctx)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFoundMany
		}

		return nil, ErrFailedToList
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

	res, err := s.db.CreateAmenity(ctx, body.Name)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrTooManyRows) {
			return nil, ErrAlreadyExists
		}

		return nil, ErrCreateAmenity
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

	err := s.db.UpdateAmenity(ctx, db.UpdateAmenityParams{
		ID:   id,
		Name: body.Name,
	})

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}

		return nil, ErrFailedToUpdate
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

	err := s.db.DeleteAmenity(ctx, id)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return ErrNotFound
		}

		return ErrFailedToDelete
	}

	return nil
}
