package lists

import (
	"context"
	"wanderlust/internal/db"
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
