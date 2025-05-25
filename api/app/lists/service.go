package lists

import (
	"context"
	"errors"
	"fmt"
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

func (s *Service) getAllLists(ctx context.Context, params dto.PaginationQueryParams) (*dto.GetAllListsOfUserOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	dbLists, err := s.db.GetAllListsOfUser(ctx, db.GetAllListsOfUserParams{
		UserID: userId,
		Offset: int32(pagination.GetOffset(params)),
		Limit:  int32(params.PageSize),
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get all lists of user")
	}

	count, err := s.db.CountAllListsOfUser(ctx, userId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to count all lists of user")
	}

	dbUser, err := s.db.GetUserById(ctx, userId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get user by id")
	}

	return &dto.GetAllListsOfUserOutput{
		Body: dto.GetAllListsOfUserOutputBody{
			Lists:      mapper.ToGetAllLists(dbLists, dbUser),
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}

func (s *Service) getPublicLists(ctx context.Context, username string, params dto.PaginationQueryParams) (*dto.GetPublicListsOfUserOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbUser, err := s.db.GetUserByUsername(ctx, username)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("user not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get user by username")
	}

	dbLists, err := s.db.GetPublicListsOfUser(ctx, db.GetPublicListsOfUserParams{
		UserID: dbUser.ID,
		Offset: int32(pagination.GetOffset(params)),
		Limit:  int32(params.PageSize),
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get public lists of user")
	}

	count, err := s.db.CountPublicListsOfUser(ctx, dbUser.ID)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to count public lists of user")
	}

	return &dto.GetPublicListsOfUserOutput{
		Body: dto.GetPublicListsOfUserOutputBody{
			Lists:      mapper.ToGetAllLists(dbLists, dbUser),
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}

func (s *Service) getList(ctx context.Context, id string) (*dto.GetListByIdOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	dbList, err := s.db.GetListById(ctx, id)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("list not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get list by id")
	}

	if !dbList.List.IsPublic && dbList.User.ID != userId {
		err = huma.Error403Forbidden("You are not authorized to access this list")
		sp.RecordError(err)
		return nil, err
	}

	dbListItems, err := s.db.GetListItems(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get list items")
	}

	return &dto.GetListByIdOutput{
		Body: dto.GetListByIdOutputBody{
			List: mapper.ToListWithItems(dbList, dbListItems),
		},
	}, nil
}

func (s *Service) getListStatus(ctx context.Context, poiId string) (*dto.GetListStatusesOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)
	lists, err := s.db.GetListIdsAndNamesOfUser(ctx, userId)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("user not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get lists by user id")
	}

	listIds := make([]string, 0)

	for _, list := range lists {
		listIds = append(listIds, list.ID)
	}

	rows, err := s.db.GetListItemsInListStatus(ctx, db.GetListItemsInListStatusParams{
		PoiID:   poiId,
		Column2: listIds,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get list items in list status")
	}

	resultArr := make([]dto.ListStatus, 0)

	for _, list := range lists {
		var includes = false

		for _, row := range rows {
			if row.ListID == list.ID {
				includes = true
				break
			}
		}

		resultArr = append(resultArr, dto.ListStatus{
			ID:       list.ID,
			Name:     list.Name,
			Includes: includes,
		})
	}

	return &dto.GetListStatusesOutput{
		Body: dto.GetListStatusesOutputBody{
			Statuses: resultArr,
		},
	}, nil
}

func (s *Service) create(ctx context.Context, body dto.CreateListInputBody) (*dto.CreateListOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)
	count, err := s.db.CountAllListsOfUser(ctx, userId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get lists count of user")
	}

	if count > MAX_LISTS_PER_USER {
		err = huma.Error422UnprocessableEntity(fmt.Sprintf("You can only have up to %d lists", MAX_LISTS_PER_USER))
		sp.RecordError(err)
		return nil, err
	}

	res, err := s.db.CreateList(ctx, db.CreateListParams{
		ID:       s.ID.Flake(),
		Name:     body.Name,
		UserID:   userId,
		IsPublic: body.IsPublic,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create list")
	}

	dbUser, err := s.db.GetUserById(ctx, userId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get user by id")
	}

	return &dto.CreateListOutput{
		Body: dto.CreateListOutputBody{
			List: mapper.ToList(res, dbUser),
		},
	}, nil
}

func (s *Service) remove(ctx context.Context, id string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	err := s.db.DeleteList(ctx, id)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return huma.Error404NotFound("List not found")
		}

		return huma.Error500InternalServerError("Failed to delete list")
	}

	return nil
}

func (s *Service) update(ctx context.Context, id string, body dto.UpdateListInputBody) (*dto.UpdateListOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	err := s.db.UpdateList(ctx, db.UpdateListParams{
		ID:       id,
		Name:     body.Name,
		IsPublic: body.IsPublic,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to update list")
	}

	dbList, err := s.db.GetListById(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get list by id")
	}

	return &dto.UpdateListOutput{
		Body: dto.UpdateListOutputBody{
			List: mapper.ToList(dbList.List, dbList.User),
		},
	}, nil
}

func (s *Service) createListItem(ctx context.Context, listId string, body dto.CreateListItemInputBody) (*dto.CreateListItemOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	lastIndex, err := s.db.GetLastIndexOfList(ctx, listId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get last index of list")
	}

	lastIndexAsInt, ok := lastIndex.(int32)

	if !ok {
		err = huma.Error500InternalServerError("Failed to cast last index of list")
		sp.RecordError(err)
		return nil, err
	}

	index := lastIndexAsInt + 1

	count, err := s.db.GetListItemCount(ctx, listId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get list item count")
	}

	if count >= MAX_ITEMS_PER_LIST {
		err = huma.Error422UnprocessableEntity(fmt.Sprintf("You can only have up to %d items", MAX_ITEMS_PER_LIST))
		sp.RecordError(err)
		return nil, err
	}

	res, err := s.db.CreateListItem(ctx, db.CreateListItemParams{
		ListID:    listId,
		PoiID:     body.PoiID,
		ListIndex: index,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create list item")
	}

	return &dto.CreateListItemOutput{
		Body: dto.CreateListItemOutputBody{
			ListID:    listId,
			PoiID:     body.PoiID,
			ListIndex: index,
			CreatedAt: res.CreatedAt.Time,
		},
	}, nil
}

func (s *Service) updateListItems(ctx context.Context, listId string, poiIds []string) (*dto.UpdateListItemsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	list, err := s.getList(ctx, listId)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	userId := ctx.Value("userId").(string)

	if list.Body.List.UserID != userId {
		err = huma.Error403Forbidden("You are not authorized to update this list")
		sp.RecordError(err)
		return nil, err
	}

	if len(poiIds) > MAX_ITEMS_PER_LIST {
		err = huma.Error422UnprocessableEntity(fmt.Sprintf("You can only have up to %d items", MAX_ITEMS_PER_LIST))
		sp.RecordError(err)
		return nil, err
	}

	tx, err := s.pool.Begin(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to begin transaction")
	}

	defer tx.Rollback(ctx)

	qtx := s.Db.Queries.WithTx(tx)

	err = qtx.DeleteAllListItems(ctx, listId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to delete all list items")
	}

	for i, poiId := range poiIds {
		_, err = qtx.CreateListItem(ctx, db.CreateListItemParams{
			ListID:    listId,
			PoiID:     poiId,
			ListIndex: int32(i + 1),
		})

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to create list item")
		}
	}

	err = tx.Commit(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to commit transaction")
	}

	list, err = s.getList(ctx, listId)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	return &dto.UpdateListItemsOutput{
		Body: dto.UpdateListItemsOutputBody{
			List: list.Body.List,
		},
	}, nil
}
