package categories

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

func (r *Repository) list(ctx context.Context) ([]db.Category, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.GetCategories(ctx)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNoCategoryFound
		}

		return nil, ErrFailedToList
	}

	return res, nil
}

type CreateParams = db.CreateCategoryParams

func (r *Repository) create(ctx context.Context, params CreateParams) (*db.Category, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.CreateCategory(ctx, params)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrTooManyRows) {
			return nil, ErrAlreadyExists
		}

		return nil, ErrFailedToCreate
	}

	return &res, nil
}

type UpdateParams = db.UpdateCategoryParams

func (r *Repository) update(ctx context.Context, params UpdateParams) (*db.Category, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.UpdateCategory(ctx, params)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}

		return nil, ErrFailedToCreate
	}

	return &res, nil
}

func (r *Repository) remove(ctx context.Context, id int16) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	err := r.db.DeleteCategory(ctx, id)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return ErrNotFound
		}

		return ErrFailedToDelete
	}

	return nil
}
