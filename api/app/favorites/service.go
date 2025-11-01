package favorites

import (
	"context"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/pagination"
	"wanderlust/pkg/tracing"
)

type Service struct {
	repo *Repository
}

func (s *Service) create(ctx context.Context, poiId string) (*CreateFavoriteOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	res, err := s.repo.create(ctx, userId, poiId)

	if err != nil {
		return nil, err
	}

	return &CreateFavoriteOutput{
		Body: CreateFavoriteOutputBody{
			ID:        res.ID,
			PlaceID:   res.PlaceID,
			UserID:    res.UserID,
			CreatedAt: res.CreatedAt.Time,
		},
	}, nil
}

func (s *Service) remove(ctx context.Context, poiId string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	return s.repo.remove(ctx, userId, poiId)
}

func (s *Service) get(ctx context.Context, params dto.PaginationQueryParams) (*GetCurrentUserFavoritesOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	offset := int32(pagination.GetOffset(params))
	limit := int32(params.PageSize)

	res, err := s.repo.listByUserId(ctx, userId, offset, limit)

	if err != nil {
		return nil, err
	}

	count, err := s.repo.countByUserId(ctx, userId)

	if err != nil {
		return nil, err
	}

	placeIds := make([]string, len(res))

	for i, v := range res {
		placeIds[i] = v.PlaceID
	}

	favorites, err := s.repo.populateWithPois(ctx, res, placeIds)

	if err != nil {
		return nil, err
	}

	return &GetCurrentUserFavoritesOutput{
		Body: GetCurrentUserFavoritesOutputBody{
			Favorites:  favorites,
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}

func (s *Service) getByUsername(ctx context.Context, username string, params dto.PaginationQueryParams) (*GetUserFavoritesByUsernameOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	user, err := s.repo.getUserByUsername(ctx, username)

	if err != nil {
		return nil, err
	}

	offset := int32(pagination.GetOffset(params))
	limit := int32(params.PageSize)
	res, err := s.repo.listByUserId(ctx, user.ID, offset, limit)

	if err != nil {
		return nil, err
	}

	count, err := s.repo.countByUserId(ctx, user.ID)

	if err != nil {
		return nil, err
	}

	placeIds := make([]string, len(res))

	for i, v := range res {
		placeIds[i] = v.PlaceID
	}

	favorites, err := s.repo.populateWithPois(ctx, res, placeIds)

	return &GetUserFavoritesByUsernameOutput{
		Body: GetUserFavoritesByUsernameOutputBody{
			Favorites:  favorites,
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}
