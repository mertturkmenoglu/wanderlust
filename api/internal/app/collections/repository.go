package collections

import (
	"context"
	"errors"
	"wanderlust/internal/db"
	"wanderlust/internal/pagination"
	"wanderlust/internal/utils"

	"github.com/jackc/pgx/v5"
)

func (r *repository) getCollections(params pagination.Params) ([]db.Collection, error) {
	res, err := r.db.Queries.GetCollections(context.Background(), db.GetCollectionsParams{
		Offset: int32(params.Offset),
		Limit:  int32(params.PageSize),
	})

	if err != nil {
		return []db.Collection{}, err
	}

	return res, nil
}

func (r *repository) countCollections() (int64, error) {
	return r.db.Queries.CountCollections(context.Background())
}

func (r *repository) getCollectionById(id string) (db.Collection, error) {
	res, err := r.db.Queries.GetCollectionById(context.Background(), id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.Collection{}, ErrCollectionNotFound
		}
		return db.Collection{}, err
	}

	return res, nil
}

func (r *repository) deleteCollection(id string) error {
	return r.db.Queries.DeleteCollection(context.Background(), id)
}

func (r *repository) getCollectionItems(id string) ([]db.GetCollectionItemsRow, error) {
	res, err := r.db.Queries.GetCollectionItems(context.Background(), id)

	if err != nil {
		return []db.GetCollectionItemsRow{}, err
	}

	return res, nil
}

func (r *repository) createCollection(dto CreateCollectionRequestDto) (db.Collection, error) {
	return r.db.Queries.CreateCollection(context.Background(), db.CreateCollectionParams{
		ID:          utils.GenerateId(r.flake),
		Name:        dto.Name,
		Description: dto.Description,
	})
}

func (r *repository) updateCollection(id string, dto UpdateCollectionRequestDto) error {
	return r.db.Queries.UpdateCollection(context.Background(), db.UpdateCollectionParams{
		Name:        dto.Name,
		Description: dto.Description,
		ID:          id,
	})
}
