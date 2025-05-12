package bookmarks

import (
	"context"
	"errors"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mapper"
	"wanderlust/pkg/pagination"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
)

type Service struct {
	app *core.Application
}

func (s *Service) create(poiId string, userId string) (*dto.CreateBookmarkOutput, error) {
	res, err := s.app.Db.Queries.CreateBookmark(context.Background(), db.CreateBookmarkParams{
		PoiID:  poiId,
		UserID: userId,
	})

	if err != nil {
		if errors.Is(err, pgx.ErrTooManyRows) {
			return nil, huma.Error422UnprocessableEntity("poi already bookmarked")
		}

		return nil, err
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

func (s *Service) remove(userId string, poiId string) error {
	return s.app.Db.Queries.DeleteBookmarkByPoiId(context.Background(), db.DeleteBookmarkByPoiIdParams{
		PoiID:  poiId,
		UserID: userId,
	})
}

func (s *Service) get(userId string, params dto.PaginationQueryParams) (*dto.GetUserBookmarksOutput, error) {
	offset := pagination.GetOffset(params)
	res, err := s.app.Db.Queries.GetBookmarksByUserId(context.Background(), db.GetBookmarksByUserIdParams{
		UserID: userId,
		Offset: int32(offset),
		Limit:  int32(params.PageSize),
	})

	if err != nil {
		return nil, err
	}

	count, err := s.app.Db.Queries.CountUserBookmarks(context.Background(), userId)

	if err != nil {
		return nil, err
	}

	return &dto.GetUserBookmarksOutput{
		Body: dto.GetUserBookmarksOutputBody{
			Bookmarks:  mapper.ToBookmarks(res),
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}
