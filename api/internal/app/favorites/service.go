package favorites

import (
	"context"
	"errors"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/dto"
	"wanderlust/internal/pkg/mapper"
	"wanderlust/internal/pkg/pagination"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
)

type Service struct {
	app *core.Application
}

func (s *Service) create(poiId string, userId string) (*dto.CreateFavoriteOutput, error) {
	res, err := s.app.Db.Queries.CreateFavorite(context.Background(), db.CreateFavoriteParams{
		PoiID:  poiId,
		UserID: userId,
	})

	if err != nil {
		if errors.Is(err, pgx.ErrTooManyRows) {
			return nil, huma.Error422UnprocessableEntity("poi already favorited")
		}

		return nil, err
	}

	return &dto.CreateFavoriteOutput{
		Body: dto.CreateFavoriteOutputBody{
			ID:        res.ID,
			PoiID:     res.PoiID,
			UserID:    res.UserID,
			CreatedAt: res.CreatedAt.Time,
		},
	}, nil
}

func (s *Service) remove(userId string, poiId string) error {
	return s.app.Db.Queries.DeleteFavoriteByPoiId(context.Background(), db.DeleteFavoriteByPoiIdParams{
		PoiID:  poiId,
		UserID: userId,
	})
}

func (s *Service) get(userId string, params dto.PaginationQueryParams) (*dto.GetUserFavoritesOutput, error) {
	offset := pagination.GetOffset(params)
	res, err := s.app.Db.Queries.GetFavoritesByUserId(context.Background(), db.GetFavoritesByUserIdParams{
		UserID: userId,
		Offset: int32(offset),
		Limit:  int32(params.PageSize),
	})

	if err != nil {
		return nil, err
	}

	count, err := s.app.Db.Queries.CountUserFavorites(context.Background(), userId)

	if err != nil {
		return nil, err
	}

	return &dto.GetUserFavoritesOutput{
		Body: dto.GetUserFavoritesOutputBody{
			Favorites:  mapper.ToFavorites(res),
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}

func (s *Service) getByUsername(username string, params dto.PaginationQueryParams) (*dto.GetUserFavoritesOutput, error) {
	user, err := s.app.Db.Queries.GetUserByUsername(context.Background(), username)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("user not found")
		}

		return nil, err
	}

	offset := pagination.GetOffset(params)
	res, err := s.app.Db.Queries.GetFavoritesByUserId(context.Background(), db.GetFavoritesByUserIdParams{
		UserID: user.ID,
		Offset: int32(offset),
		Limit:  int32(params.PageSize),
	})

	if err != nil {
		return nil, err
	}

	count, err := s.app.Db.Queries.CountUserFavorites(context.Background(), user.ID)

	if err != nil {
		return nil, err
	}

	return &dto.GetUserFavoritesOutput{
		Body: dto.GetUserFavoritesOutputBody{
			Favorites:  mapper.ToFavorites(res),
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}
