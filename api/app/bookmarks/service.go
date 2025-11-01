package bookmarks

import (
	"context"
	"wanderlust/app/pois"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/pagination"
	"wanderlust/pkg/tracing"

	"github.com/cockroachdb/errors"
)

type Service struct {
	placesService *pois.Service
	repo          *Repository
}

func (s *Service) create(ctx context.Context, body CreateBookmarkInputBody) (*CreateBookmarkOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	res, err := s.repo.create(ctx, CreateParams{
		PlaceID: body.PlaceID,
		UserID:  userId,
	})

	if err != nil {
		return nil, err
	}

	return &CreateBookmarkOutput{
		Body: CreateBookmarkOutputBody{
			ID:        res.ID,
			PlaceID:   res.PlaceID,
			UserID:    res.UserID,
			CreatedAt: res.CreatedAt.Time,
		},
	}, nil
}

func (s *Service) remove(ctx context.Context, placeId string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	return s.repo.remove(ctx, RemoveParams{
		PlaceID: placeId,
		UserID:  userId,
	})
}

func (s *Service) list(ctx context.Context, params dto.PaginationQueryParams) (*GetUserBookmarksOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	res, err := s.repo.list(ctx, ListParams{
		UserID: userId,
		Offset: pagination.GetOffset(params),
		Limit:  params.PageSize,
	})

	if err != nil {
		return nil, err
	}

	count, err := s.repo.count(ctx, userId)

	if err != nil {
		return nil, err
	}

	placeIds := make([]string, len(res))

	for i, v := range res {
		placeIds[i] = v.PlaceID
	}

	places, err := s.placesService.FindMany(ctx, placeIds)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToList, err.Error())
	}

	bookmarks := make([]dto.Bookmark, len(res))

	for i, v := range res {
		var place *dto.Place = nil

		for _, p := range places {
			if p.ID == v.PlaceID {
				place = &p
				break
			}
		}

		if place == nil {
			return nil, errors.Wrap(ErrFailedToList, "failed to find place for bookmark")
		}

		bookmarks[i] = dto.ToBookmark(v, *place)
	}

	return &GetUserBookmarksOutput{
		Body: GetUserBookmarksOutputBody{
			Bookmarks:  bookmarks,
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}
