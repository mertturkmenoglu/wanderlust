package categories

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

func (r *Repository) list(ctx context.Context) ([]db.Category, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.FindManyCategories(ctx)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.Wrap(ErrNoCategoryFound, err.Error())
		}

		return nil, errors.Wrap(ErrFailedToList, err.Error())
	}

	return res, nil
}

type CreateParams = db.CreateCategoryParams

func (r *Repository) create(ctx context.Context, params CreateParams) (*db.Category, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.CreateCategory(ctx, params)

	if err != nil {
		if errors.Is(err, pgx.ErrTooManyRows) {
			return nil, errors.Wrap(ErrAlreadyExists, err.Error())
		}

		return nil, errors.Wrap(ErrFailedToCreate, err.Error())
	}

	return &res, nil
}

type UpdateParams = db.UpdateCategoryParams

func (r *Repository) update(ctx context.Context, params UpdateParams) (*db.Category, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	_, err := r.db.UpdateCategory(ctx, params)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.Wrap(ErrNotFound, err.Error())
		}

		return nil, errors.Wrap(ErrFailedToUpdate, err.Error())
	}

	res, err := r.db.FindCategoryById(ctx, params.ID)

	if err != nil {
		return nil, errors.Wrap(ErrNotFound, err.Error())
	}

	return &res, nil
}

func (r *Repository) remove(ctx context.Context, id int16) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tag, err := r.db.RemoveCategoryById(ctx, id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return errors.Wrap(ErrNotFound, err.Error())
		}

		return errors.Wrap(ErrFailedToDelete, err.Error())
	}

	if tag.RowsAffected() == 0 {
		return ErrNotFound
	}

	return nil
}
