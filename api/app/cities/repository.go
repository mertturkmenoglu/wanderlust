package cities

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

func (r *Repository) list(ctx context.Context) ([]db.City, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.GetCities(ctx)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.Wrap(ErrNoCityFound, err.Error())
		}

		return nil, errors.Wrap(ErrFailedToList, err.Error())
	}

	return res, nil
}

func (r *Repository) listFeatured(ctx context.Context) ([]db.City, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	featuredCitiesIds := []int32{
		1106, // Salzburg
		1108, // Vienna
		1109, // Istanbul
		2300, // Athens
		3012, // Rome
		3014, // Turin
		3015, // Florence
		3016, // Venice
		4010, // Prague
		5010, // Amsterdam
		6010, // Paris
		7010, // Barcelona
	}

	res, err := r.db.GetFeaturedCities(ctx, featuredCitiesIds)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.Wrap(ErrNoCityFound, err.Error())
		}

		return nil, errors.Wrap(ErrFailedToListFeatured, err.Error())
	}

	return res, nil
}

func (r *Repository) get(ctx context.Context, id int32) (*db.City, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.GetCityById(ctx, id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.Wrap(ErrNotFound, err.Error())
		}

		return nil, errors.Wrap(ErrFailedToList, err.Error())
	}

	return &res, nil
}

type CreateParams = db.CreateCityParams

func (r *Repository) create(ctx context.Context, params CreateParams) (*db.City, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.CreateCity(ctx, params)

	if err != nil {
		if errors.Is(err, pgx.ErrTooManyRows) {
			return nil, errors.Wrap(ErrAlreadyExists, err.Error())
		}

		return nil, errors.Wrap(ErrFailedToCreate, err.Error())
	}

	return &res, nil
}

func (r *Repository) remove(ctx context.Context, id int32) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	err := r.db.DeleteCity(ctx, id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return errors.Wrap(ErrNotFound, err.Error())
		}

		return errors.Wrap(ErrFailedToDelete, err.Error())
	}

	return nil
}

type UpdateParams = db.UpdateCityParams

func (r *Repository) update(ctx context.Context, params UpdateParams) (*db.City, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.UpdateCity(ctx, params)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.Wrap(ErrNotFound, err.Error())
		}

		return nil, errors.Wrap(ErrFailedToUpdate, err.Error())
	}

	return &res, nil
}
