package lists

import (
	"context"
	"wanderlust/internal/db"
	"wanderlust/internal/pagination"
	"wanderlust/internal/utils"
)

func (r *repository) createList(dto CreateListRequestDto, userId string) (db.List, error) {
	return r.db.Queries.CreateList(context.Background(), db.CreateListParams{
		ID:       utils.GenerateId(r.flake),
		Name:     dto.Name,
		UserID:   userId,
		IsPublic: dto.IsPublic,
	})
}

func (r *repository) getListById(id string) (db.List, error) {
	return r.db.Queries.GetListById(context.Background(), id)
}

func (r *repository) getListItems(listId string) ([]db.GetListItemsRow, error) {
	return r.db.Queries.GetListItems(context.Background(), listId)
}

func (r *repository) deleteList(id string) error {
	return r.db.Queries.DeleteList(context.Background(), id)
}

func (r *repository) getAllListsOfUser(userId string, params pagination.Params) ([]db.List, error) {
	return r.db.Queries.GetAllListsOfUser(context.Background(), db.GetAllListsOfUserParams{
		UserID: userId,
		Offset: int32(params.Offset),
		Limit:  int32(params.PageSize),
	})
}

func (r *repository) countListsOfUser(userId string) (int64, error) {
	return r.db.Queries.CountAllListsOfUser(context.Background(), userId)
}
