package lists

import (
	"context"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/pagination"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/uid"
)

type Service struct {
	repo *Repository
}

func (s *Service) getAllLists(ctx context.Context, params dto.PaginationQueryParams) (*GetAllListsOfUserOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	lists, count, err := s.repo.listByUserId(ctx, userId, params)

	if err != nil {
		return nil, err
	}

	return &GetAllListsOfUserOutput{
		Body: GetAllListsOfUserOutputBody{
			Lists:      lists,
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}

func (s *Service) getPublicLists(ctx context.Context, username string, params dto.PaginationQueryParams) (*GetPublicListsOfUserOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	lists, count, err := s.repo.listPublicLists(ctx, username, params)

	if err != nil {
		return nil, err
	}

	return &GetPublicListsOfUserOutput{
		Body: GetPublicListsOfUserOutputBody{
			Lists:      lists,
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}

func (s *Service) getList(ctx context.Context, id string) (*GetListByIdOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	list, err := s.repo.getWithItems(ctx, id)

	if err != nil {
		return nil, err
	}

	if !list.IsPublic && list.UserID != userId {
		return nil, ErrNotAuthorizedToAccess
	}

	return &GetListByIdOutput{
		Body: GetListByIdOutputBody{
			List: *list,
		},
	}, nil
}

func (s *Service) getListStatus(ctx context.Context, placeId string) (*GetListStatusesOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	lists, err := s.repo.getListStatus(ctx, userId, placeId)

	if err != nil {
		return nil, err
	}

	return &GetListStatusesOutput{
		Body: GetListStatusesOutputBody{
			Statuses: lists,
		},
	}, nil
}

func (s *Service) create(ctx context.Context, body CreateListInputBody) (*CreateListOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)
	count, err := s.repo.countUserLists(ctx, userId)

	if err != nil {
		return nil, err
	}

	if count > MAX_LISTS_PER_USER {
		return nil, ErrMaxListsReached
	}

	res, err := s.repo.create(ctx, userId, CreateParams{
		ID:       uid.Flake(),
		Name:     body.Name,
		UserID:   userId,
		IsPublic: body.IsPublic,
	})

	if err != nil {
		return nil, err
	}

	return &CreateListOutput{
		Body: CreateListOutputBody{
			List: *res,
		},
	}, nil
}

func (s *Service) remove(ctx context.Context, id string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	list, err := s.repo.getWithoutItems(ctx, id)

	if err != nil {
		return err
	}

	if list.UserID != userId {
		return ErrNotAuthorizedToDelete
	}

	return s.repo.remove(ctx, id)
}

func (s *Service) update(ctx context.Context, id string, body UpdateListInputBody) (*UpdateListOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	list, err := s.repo.getWithoutItems(ctx, id)

	if err != nil {
		return nil, err
	}

	userId := ctx.Value("userId").(string)

	if list.UserID != userId {
		return nil, ErrNotAuthorizedToUpdate
	}

	err = s.repo.update(ctx, UpdateParams{
		ID:       id,
		Name:     body.Name,
		IsPublic: body.IsPublic,
	})

	if err != nil {
		return nil, err
	}

	list, err = s.repo.getWithoutItems(ctx, id)

	if err != nil {
		return nil, err
	}

	return &UpdateListOutput{
		Body: UpdateListOutputBody{
			List: *list,
		},
	}, nil
}

func (s *Service) createListItem(ctx context.Context, listId string, body CreateListItemInputBody) (*CreateListItemOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	list, err := s.repo.getWithoutItems(ctx, listId)

	if err != nil {
		return nil, err
	}

	userId := ctx.Value("userId").(string)

	if list.UserID != userId {
		return nil, ErrNotAuthorizedToUpdate
	}

	res, err := s.repo.createItem(ctx, listId, body.PlaceID)

	if err != nil {
		return nil, err
	}

	return &CreateListItemOutput{
		Body: CreateListItemOutputBody{
			ListID:    res.ListID,
			PlaceID:   res.PlaceID,
			Index:     res.Index,
			CreatedAt: res.CreatedAt.Time,
		},
	}, nil
}

func (s *Service) updateListItems(ctx context.Context, listId string, placeIds []string) (*UpdateListItemsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	list, err := s.repo.getWithoutItems(ctx, listId)

	if err != nil {
		return nil, err
	}

	userId := ctx.Value("userId").(string)

	if list.UserID != userId {
		return nil, ErrNotAuthorizedToUpdate
	}

	if len(placeIds) > MAX_ITEMS_PER_LIST {
		return nil, ErrMaxListItemsReached
	}

	err = s.repo.updateItems(ctx, listId, placeIds)

	if err != nil {
		return nil, err
	}

	list, err = s.repo.getWithItems(ctx, listId)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	return &UpdateListItemsOutput{
		Body: UpdateListItemsOutputBody{
			List: *list,
		},
	}, nil
}
