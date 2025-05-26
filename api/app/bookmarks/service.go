package bookmarks

import (
	"context"
	"errors"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mapper"
	"wanderlust/pkg/pagination"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Service struct {
	*core.Application
	db   *db.Queries
	pool *pgxpool.Pool
}

func (s *Service) create(ctx context.Context, body dto.CreateBookmarkInputBody) (*dto.CreateBookmarkOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	res, err := s.db.CreateBookmark(ctx, db.CreateBookmarkParams{
		PoiID:  body.PoiId,
		UserID: userId,
	})

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrTooManyRows) {
			return nil, huma.Error422UnprocessableEntity("Point of Interest is already bookmarked")
		}

		return nil, huma.Error500InternalServerError("Failed to create bookmark")
	}

	return &dto.CreateBookmarkOutput{
		Body: dto.CreateBookmarkOutputBody{
			ID:        res.ID,
			PoiID:     res.PoiID,
			UserID:    res.UserID,
			CreatedAt: res.CreatedAt.Time,
		},
	}, nil
}

func (s *Service) remove(ctx context.Context, poiId string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	err := s.db.DeleteBookmarkByPoiId(ctx, db.DeleteBookmarkByPoiIdParams{
		PoiID:  poiId,
		UserID: userId,
	})

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return huma.Error404NotFound("Point of Interest is not bookmarked")
		}

		return huma.Error500InternalServerError("Failed to delete bookmark")
	}

	return nil
}

func (s *Service) get(ctx context.Context, params dto.PaginationQueryParams) (*dto.GetUserBookmarksOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	res, err := s.db.GetBookmarksByUserId(ctx, db.GetBookmarksByUserIdParams{
		UserID: userId,
		Offset: int32(pagination.GetOffset(params)),
		Limit:  int32(params.PageSize),
	})

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("User not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get bookmarks")
	}

	count, err := s.db.CountUserBookmarks(ctx, userId)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("User not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get bookmarks")
	}

	return &dto.GetUserBookmarksOutput{
		Body: dto.GetUserBookmarksOutputBody{
			Bookmarks:  mapper.ToBookmarks(res),
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}
