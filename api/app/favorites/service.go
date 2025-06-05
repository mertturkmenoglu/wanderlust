package favorites

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

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Service struct {
	*core.Application
	poiService *pois.Service
	db         *db.Queries
	pool       *pgxpool.Pool
}

func (s *Service) create(ctx context.Context, poiId string) (*dto.CreateFavoriteOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	res, err := s.db.CreateFavorite(ctx, db.CreateFavoriteParams{
		PoiID:  poiId,
		UserID: userId,
	})

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrTooManyRows) {
			return nil, huma.Error422UnprocessableEntity("Point of Interest is already favorited")
		}

		return nil, huma.Error500InternalServerError("Failed to create favorite")
	}

	return &dto.CreateFavoriteOutput{
		Body: dto.CreateFavoriteOutputBody{
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
	err := s.db.DeleteFavoriteByPoiId(ctx, db.DeleteFavoriteByPoiIdParams{
		PoiID:  poiId,
		UserID: userId,
	})

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return huma.Error404NotFound("Point of Interest not found")
		}

		return huma.Error500InternalServerError("Failed to delete favorite")
	}

	return nil
}

func (s *Service) get(ctx context.Context, params dto.PaginationQueryParams) (*dto.GetUserFavoritesOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	res, err := s.db.GetFavoritesByUserId(ctx, db.GetFavoritesByUserIdParams{
		UserID: userId,
		Offset: int32(pagination.GetOffset(params)),
		Limit:  int32(params.PageSize),
	})

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("User not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get favorites")
	}

	count, err := s.db.CountUserFavorites(ctx, userId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get favorites count")
	}

	poiIds := make([]string, len(res))

	for i, v := range res {
		poiIds[i] = v.PoiID
	}

	pois, err := s.poiService.FindMany(ctx, poiIds)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get favorites")
	}

	favorites := make([]dto.Favorite, len(res))

	for i, v := range res {
		favorites[i] = mapper.ToFavorite(v, pois[i])
	}

	return &dto.GetUserFavoritesOutput{
		Body: dto.GetUserFavoritesOutputBody{
			Favorites:  favorites,
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}

func (s *Service) getByUsername(ctx context.Context, username string, params dto.PaginationQueryParams) (*dto.GetUserFavoritesOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	user, err := s.db.GetUserByUsername(ctx, username)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("User not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get favorites")
	}

	res, err := s.db.GetFavoritesByUserId(ctx, db.GetFavoritesByUserIdParams{
		UserID: user.ID,
		Offset: int32(pagination.GetOffset(params)),
		Limit:  int32(params.PageSize),
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get favorites")
	}

	count, err := s.db.CountUserFavorites(ctx, user.ID)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get favorites count")
	}

	poiIds := make([]string, len(res))

	for i, v := range res {
		poiIds[i] = v.PoiID
	}

	pois, err := s.poiService.FindMany(ctx, poiIds)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get favorites")
	}

	favorites := make([]dto.Favorite, len(res))

	for i, v := range res {
		favorites[i] = mapper.ToFavorite(v, pois[i])
	}

	return &dto.GetUserFavoritesOutput{
		Body: dto.GetUserFavoritesOutputBody{
			Favorites:  favorites,
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}
