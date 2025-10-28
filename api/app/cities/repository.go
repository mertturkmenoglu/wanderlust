package cities

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

func (r *Repository) list(ctx context.Context) ([]db.City, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.GetCities(ctx)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNoCityFound
		}

		return nil, ErrFailedToList
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
			return nil, ErrNoCityFound
		}

		return nil, ErrFailedToListFeatured
	}

	return res, nil
}

func (r *Repository) get(ctx context.Context, id int32) (*db.City, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.GetCityById(ctx, id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}

		return nil, ErrFailedToList
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
			return nil, ErrAlreadyExists
		}

		return nil, ErrFailedToCreate
	}

	return &res, nil
}

func (r *Repository) remove(ctx context.Context, id int32) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	err := r.db.DeleteCity(ctx, id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrNotFound
		}

		return ErrFailedToDelete
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
			return nil, ErrNotFound
		}

		return nil, ErrFailedToUpdate
	}

	return &res, nil
}
