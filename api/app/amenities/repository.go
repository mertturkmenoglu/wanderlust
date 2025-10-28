package amenities

import (
	"context"
	"errors"
	"wanderlust/pkg/db"
	"wanderlust/pkg/tracing"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	db   *db.Queries
	pool *pgxpool.Pool
}

func (r *Repository) list(ctx context.Context) ([]db.Amenity, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.GetAllAmenities(ctx)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFoundMany
		}

		return nil, ErrFailedToList
	}

	return res, nil
}

func (r *Repository) create(ctx context.Context, name string) (db.Amenity, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.CreateAmenity(ctx, name)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrTooManyRows) {
			return db.Amenity{}, ErrAlreadyExists
		}

		return db.Amenity{}, ErrCreateAmenity
	}

	return res, nil
}

type UpdateParams = db.UpdateAmenityParams

func (r *Repository) update(ctx context.Context, params UpdateParams) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	err := r.db.UpdateAmenity(ctx, params)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return ErrNotFound
		}

		return ErrFailedToUpdate
	}

	return nil
}

func (r *Repository) remove(ctx context.Context, id int32) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	err := r.db.DeleteAmenity(ctx, id)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return ErrNotFound
		}

		return ErrFailedToDelete
	}

	return nil
}
