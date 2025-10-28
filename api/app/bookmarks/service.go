package bookmarks

import (
	"context"
	"errors"
	"wanderlust/app/pois"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mapper"
	"wanderlust/pkg/pagination"
	"wanderlust/pkg/tracing"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Service struct {
	*core.Application
	poiService *pois.Service
	db         *db.Queries
	pool       *pgxpool.Pool
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
			return nil, ErrAlreadyBookmarked
		}

		return nil, ErrCreateBookmark
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
			return ErrNotBookmarked
		}

		return ErrDeleteBookmark
	}

	return nil
}

func (s *Service) get(ctx context.Context, params dto.PaginationQueryParams) (*dto.GetUserBookmarksOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	res, err := s.db.GetBookmarksByUserId(ctx, db.GetBookmarksByUserIdParams{
		UserID: userId,
		Offset: pagination.GetOffset(params),
		Limit:  params.PageSize,
	})

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrUserNotFound
		}

		return nil, ErrFailedToList
	}

	count, err := s.db.CountUserBookmarks(ctx, userId)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrUserNotFound
		}

		return nil, ErrFailedToList
	}

	poiIds := make([]string, len(res))

	for i, v := range res {
		poiIds[i] = v.PoiID
	}

	pois, err := s.poiService.FindMany(ctx, poiIds)

	if err != nil {
		sp.RecordError(err)
		return nil, ErrFailedToList
	}

	bookmarks := make([]dto.Bookmark, len(res))

	for i, v := range res {
		bookmarks[i] = mapper.ToBookmark(v, pois[i])
	}

	return &dto.GetUserBookmarksOutput{
		Body: dto.GetUserBookmarksOutputBody{
			Bookmarks:  bookmarks,
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}
