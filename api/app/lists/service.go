package lists

import (
	"context"
	"errors"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mapper"
	"wanderlust/pkg/pagination"
	"wanderlust/pkg/utils"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
)

type Service struct {
	app *core.Application
}

func (s *Service) getAllLists(userId string, params dto.PaginationQueryParams) (*dto.GetAllListsOfUserOutput, error) {
	dbLists, err := s.app.Db.Queries.GetAllListsOfUser(context.Background(), db.GetAllListsOfUserParams{
		UserID: userId,
		Offset: int32(pagination.GetOffset(params)),
		Limit:  int32(params.PageSize),
	})

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to get all lists of user")
	}

	count, err := s.app.Db.Queries.CountAllListsOfUser(context.Background(), userId)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to count all lists of user")
	}

	dbUser, err := s.app.Db.Queries.GetUserById(context.Background(), userId)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to get user by id")
	}

	return &dto.GetAllListsOfUserOutput{
		Body: dto.GetAllListsOfUserOutputBody{
			Lists:      mapper.ToGetAllLists(dbLists, dbUser),
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}

func (s *Service) getPublicLists(username string, params dto.PaginationQueryParams) (*dto.GetPublicListsOfUserOutput, error) {
	dbUser, err := s.app.Db.Queries.GetUserByUsername(context.Background(), username)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("user not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get user by username")
	}

	dbLists, err := s.app.Db.Queries.GetPublicListsOfUser(context.Background(), db.GetPublicListsOfUserParams{
		UserID: dbUser.ID,
		Offset: int32(pagination.GetOffset(params)),
		Limit:  int32(params.PageSize),
	})

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to get public lists of user")
	}

	count, err := s.app.Db.Queries.CountPublicListsOfUser(context.Background(), dbUser.ID)

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

func (s *Service) getList(id string) (*dto.GetListByIdOutput, error) {
	dbList, err := s.app.Db.Queries.GetListById(context.Background(), id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("list not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get list by id")
	}

	dbListItems, err := s.app.Db.Queries.GetListItems(context.Background(), id)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to get list items")
	}

	return &dto.GetListByIdOutput{
		Body: dto.GetListByIdOutputBody{
			List: mapper.ToListWithItems(dbList, dbListItems),
		},
	}, nil
}

func (s *Service) getListStatus(userId string, poiId string) (*dto.GetListStatusesOutput, error) {
	lists, err := s.app.Db.Queries.GetListIdsAndNamesOfUser(context.Background(), userId)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("user not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get lists by user id")
	}

	listIds := make([]string, 0)

	for _, list := range lists {
		listIds = append(listIds, list.ID)
	}

	rows, err := s.app.Db.Queries.GetListItemsInListStatus(context.Background(), db.GetListItemsInListStatusParams{
		PoiID:   poiId,
		Column2: listIds,
	})

	if err != nil {
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

func (s *Service) createList(userId string, body dto.CreateListInputBody) (*dto.CreateListOutput, error) {
	res, err := s.app.Db.Queries.CreateList(context.Background(), db.CreateListParams{
		ID:       utils.GenerateId(s.app.Flake),
		Name:     body.Name,
		UserID:   userId,
		IsPublic: body.IsPublic,
	})

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to create list")
	}

	dbUser, err := s.app.Db.Queries.GetUserById(context.Background(), userId)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to get user by id")
	}

	return &dto.CreateListOutput{
		Body: dto.CreateListOutputBody{
			List: mapper.ToList(res, dbUser),
		},
	}, nil
}

func (s *Service) deleteList(id string) error {
	return s.app.Db.Queries.DeleteList(context.Background(), id)
}

func (s *Service) updateList(id string, body dto.UpdateListInputBody) (*dto.UpdateListOutput, error) {
	err := s.app.Db.Queries.UpdateList(context.Background(), db.UpdateListParams{
		ID:       id,
		Name:     body.Name,
		IsPublic: body.IsPublic,
	})

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to update list")
	}

	dbList, err := s.app.Db.Queries.GetListById(context.Background(), id)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to get list by id")
	}

	return &dto.UpdateListOutput{
		Body: dto.UpdateListOutputBody{
			List: mapper.ToList(dbList.List, dbList.User),
		},
	}, nil
}

func (s *Service) createListItem(listId string, body dto.CreateListItemInputBody) (*dto.CreateListItemOutput, error) {
	lastIndex, err := s.app.Db.Queries.GetLastIndexOfList(context.Background(), listId)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to get last index of list")
	}

	lastIndexAsInt, ok := lastIndex.(int32)

	if !ok {
		return nil, huma.Error500InternalServerError("Failed to cast last index of list")
	}

	index := lastIndexAsInt + 1

	res, err := s.app.Db.Queries.CreateListItem(context.Background(), db.CreateListItemParams{
		ListID:    listId,
		PoiID:     body.PoiID,
		ListIndex: index,
	})

	if err != nil {
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
