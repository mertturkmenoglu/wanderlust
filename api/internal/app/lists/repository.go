package lists

import (
	"context"
	"errors"
	"fmt"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/pagination"
	"wanderlust/internal/pkg/utils"

	"github.com/jackc/pgx/v5"
)

func (r *repository) createList(dto CreateListRequestDto, userId string) (db.List, error) {
	return r.di.Db.Queries.CreateList(context.Background(), db.CreateListParams{
		ID:       utils.GenerateId(r.di.Flake),
		Name:     dto.Name,
		UserID:   userId,
		IsPublic: dto.IsPublic,
	})
}

func (r *repository) getListById(id string) (db.GetListByIdRow, error) {
	return r.di.Db.Queries.GetListById(context.Background(), id)
}

func (r *repository) getListItems(listId string) ([]db.GetListItemsRow, error) {
	return r.di.Db.Queries.GetListItems(context.Background(), listId)
}

func (r *repository) deleteList(id string) error {
	return r.di.Db.Queries.DeleteList(context.Background(), id)
}

func (r *repository) getAllListsOfUser(userId string, params pagination.Params) ([]db.List, error) {
	return r.di.Db.Queries.GetAllListsOfUser(context.Background(), db.GetAllListsOfUserParams{
		UserID: userId,
		Offset: int32(params.Offset),
		Limit:  int32(params.PageSize),
	})
}

func (r *repository) countListsOfUser(userId string) (int64, error) {
	return r.di.Db.Queries.CountAllListsOfUser(context.Background(), userId)
}

func (r *repository) getUserIdByUsername(username string) (string, error) {
	user, err := r.di.Db.Queries.GetUserByUsername(context.Background(), username)

	if err != nil {
		fmt.Println("err happened", err, username)
		return "", err
	}

	return user.ID, nil
}

func (r *repository) getPublicListsOfUser(userId string, params pagination.Params) ([]db.List, error) {
	return r.di.Db.Queries.GetPublicListsOfUser(context.Background(), db.GetPublicListsOfUserParams{
		UserID: userId,
		Offset: int32(params.Offset),
		Limit:  int32(params.PageSize),
	})
}

func (r *repository) countPublicListsOfUser(userId string) (int64, error) {
	return r.di.Db.Queries.CountPublicListsOfUser(context.Background(), userId)
}

func (r *repository) addItemToEndOfList(listId string, poiId string) (db.ListItem, error) {
	lastIndex, err := r.di.Db.Queries.GetLastIndexOfList(context.Background(), listId)

	if err != nil {
		return db.ListItem{}, err
	}

	lastIndexAsInt, ok := lastIndex.(int32)

	if !ok {
		return db.ListItem{}, ErrListIndexCast
	}

	index := lastIndexAsInt + 1

	return r.di.Db.Queries.CreateListItem(context.Background(), db.CreateListItemParams{
		ListID:    listId,
		PoiID:     poiId,
		ListIndex: index,
	})
}

func (r *repository) getListStatus(userId string, poiId string) ([]ListStatusDto, error) {
	lists, err := r.di.Db.Queries.GetListIdsAndNamesOfUser(context.Background(), userId)

	if err != nil {
		r.di.Logger.Trace("error", r.di.Logger.Args("error", err.Error()))
		empty := make([]ListStatusDto, 0)

		if errors.Is(err, pgx.ErrNoRows) {
			return empty, nil
		}

		return nil, err
	}

	listIds := make([]string, 0)

	for _, list := range lists {
		listIds = append(listIds, list.ID)
	}

	rows, err := r.di.Db.Queries.GetListItemsInListStatus(context.Background(), db.GetListItemsInListStatusParams{
		PoiID:   poiId,
		Column2: listIds,
	})

	if err != nil {
		return nil, err
	}

	resultArr := make([]ListStatusDto, 0)

	for _, list := range lists {
		var includes = false

		for _, row := range rows {
			if row.ListID == list.ID {
				includes = true
				break
			}
		}

		resultArr = append(resultArr, ListStatusDto{
			ID:       list.ID,
			Name:     list.Name,
			Includes: includes,
		})
	}

	return resultArr, nil
}

func (r *repository) updateList(id string, dto UpdateListRequestDto) error {
	return r.di.Db.Queries.UpdateList(context.Background(), db.UpdateListParams{
		ID:       id,
		Name:     dto.Name,
		IsPublic: dto.IsPublic,
	})
}
