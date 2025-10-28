package bookmarks

import (
	"context"
	"wanderlust/app/pois"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mapper"
	"wanderlust/pkg/pagination"
	"wanderlust/pkg/tracing"
)

type Service struct {
	poiService *pois.Service
	repo       *Repository
}

func (s *Service) create(ctx context.Context, body dto.CreateBookmarkInputBody) (*dto.CreateBookmarkOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	res, err := s.repo.create(ctx, CreateParams{
		PoiID:  body.PoiId,
		UserID: userId,
	})

	if err != nil {
		sp.RecordError(err)
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

func (s *Service) remove(ctx context.Context, poiId string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	return s.repo.remove(ctx, RemoveParams{
		PoiID:  poiId,
		UserID: userId,
	})
}

func (s *Service) list(ctx context.Context, params dto.PaginationQueryParams) (*dto.GetUserBookmarksOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	res, err := s.repo.list(ctx, ListParams{
		UserID: userId,
		Offset: pagination.GetOffset(params),
		Limit:  params.PageSize,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	count, err := s.repo.count(ctx, userId)

	if err != nil {
		sp.RecordError(err)
		return nil, err
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
