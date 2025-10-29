package bookmarks

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

type CreateParams = db.CreateBookmarkParams

func (r *Repository) create(ctx context.Context, params CreateParams) (*db.Bookmark, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.CreateBookmark(ctx, params)

	if err != nil {
		if errors.Is(err, pgx.ErrTooManyRows) {
			return nil, errors.Wrap(ErrAlreadyBookmarked, err.Error())
		}

		return nil, errors.Wrap(ErrCreateBookmark, err.Error())
	}

	return &res, nil
}

type RemoveParams = db.DeleteBookmarkByPoiIdParams

func (r *Repository) remove(ctx context.Context, params RemoveParams) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	err := r.db.DeleteBookmarkByPoiId(ctx, params)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return errors.Wrap(ErrNotBookmarked, err.Error())
		}

		return errors.Wrap(ErrDeleteBookmark, err.Error())
	}

	return nil
}

type ListParams = db.GetBookmarksByUserIdParams

func (r *Repository) list(ctx context.Context, params ListParams) ([]db.Bookmark, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.GetBookmarksByUserId(ctx, params)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.Wrap(ErrUserNotFound, err.Error())
		}

		return nil, errors.Wrap(ErrFailedToList, err.Error())
	}

	return res, nil
}

func (r *Repository) count(ctx context.Context, userId string) (int64, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.CountUserBookmarks(ctx, userId)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return 0, errors.Wrap(ErrUserNotFound, err.Error())
		}

		return 0, errors.Wrap(ErrFailedToList, err.Error())
	}

	return res, nil
}
