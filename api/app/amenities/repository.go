package amenities

import (
	"context"
	"wanderlust/pkg/db"
	"wanderlust/pkg/tracing"

	"github.com/cockroachdb/errors"
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
			return nil, errors.Wrap(ErrNotFoundMany, err.Error())
		}

		return nil, errors.Wrap(ErrFailedToList, err.Error())
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
			return db.Amenity{}, errors.Wrap(ErrAlreadyExists, err.Error())
		}

		return db.Amenity{}, errors.Wrap(ErrCreateAmenity, err.Error())
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
			return errors.Wrap(ErrNotFound, err.Error())
		}

		return errors.Wrap(ErrFailedToUpdate, err.Error())
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
			return errors.Wrap(ErrNotFound, err.Error())
		}

		return errors.Wrap(ErrFailedToDelete, err.Error())
	}

	return nil
}
