package bookmarks

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

type CreateParams = db.CreateBookmarkParams

func (r *Repository) create(ctx context.Context, params CreateParams) (*db.Bookmark, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.CreateBookmark(ctx, params)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrTooManyRows) {
			return nil, ErrAlreadyBookmarked
		}

		return nil, ErrCreateBookmark
	}

	return &res, nil
}

type RemoveParams = db.DeleteBookmarkByPoiIdParams

func (r *Repository) remove(ctx context.Context, params RemoveParams) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	err := r.db.DeleteBookmarkByPoiId(ctx, params)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return ErrNotBookmarked
		}

		return ErrDeleteBookmark
	}

	return nil
}

type ListParams = db.GetBookmarksByUserIdParams

func (r *Repository) list(ctx context.Context, params ListParams) ([]db.Bookmark, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.GetBookmarksByUserId(ctx, params)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrUserNotFound
		}

		return nil, ErrFailedToList
	}

	return res, nil
}

func (r *Repository) count(ctx context.Context, userId string) (int64, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.CountUserBookmarks(ctx, userId)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return 0, ErrUserNotFound
		}

		return 0, ErrFailedToList
	}

	return res, nil
}
