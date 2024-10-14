package lists

import (
	"context"
	"fmt"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/pagination"
	"wanderlust/internal/pkg/utils"
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
