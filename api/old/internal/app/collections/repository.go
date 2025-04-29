package collections

import (
	"context"
	"errors"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/pagination"
	"wanderlust/internal/pkg/utils"

	"github.com/jackc/pgx/v5"
)

func (r *repository) getCollections(params pagination.Params) ([]db.Collection, error) {
	res, err := r.di.Db.Queries.GetCollections(context.Background(), db.GetCollectionsParams{
		Offset: int32(params.Offset),
		Limit:  int32(params.PageSize),
	})

	if err != nil {
		return []db.Collection{}, err
	}

	return res, nil
}

func (r *repository) countCollections() (int64, error) {
	return r.di.Db.Queries.CountCollections(context.Background())
}

func (r *repository) getCollectionById(id string) (db.Collection, error) {
	res, err := r.di.Db.Queries.GetCollectionById(context.Background(), id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.Collection{}, ErrCollectionNotFound
		}
		return db.Collection{}, err
	}

	return res, nil
}

func (r *repository) deleteCollection(id string) error {
	return r.di.Db.Queries.DeleteCollection(context.Background(), id)
}

func (r *repository) getCollectionItems(id string) ([]db.GetCollectionItemsRow, error) {
	res, err := r.di.Db.Queries.GetCollectionItems(context.Background(), id)

	if err != nil {
		return []db.GetCollectionItemsRow{}, err
	}

	return res, nil
}

func (r *repository) createCollection(dto CreateCollectionRequestDto) (db.Collection, error) {
	return r.di.Db.Queries.CreateCollection(context.Background(), db.CreateCollectionParams{
		ID:          utils.GenerateId(r.di.Flake),
		Name:        dto.Name,
		Description: dto.Description,
	})
}

func (r *repository) updateCollection(id string, dto UpdateCollectionRequestDto) error {
	return r.di.Db.Queries.UpdateCollection(context.Background(), db.UpdateCollectionParams{
		Name:        dto.Name,
		Description: dto.Description,
		ID:          id,
	})
}

func (r *repository) createCollectionItem(collectionId string, dto CreateCollectionItemRequestDto, listIndex int32) (db.CollectionItem, error) {
	return r.di.Db.Queries.CreateCollectionItem(context.Background(), db.CreateCollectionItemParams{
		CollectionID: collectionId,
		PoiID:        dto.PoiID,
		ListIndex:    listIndex,
	})
}

func (r *repository) getLastIndexOfCollection(collectionId string) (int32, error) {
	res, err := r.di.Db.Queries.GetLastIndexOfCollection(context.Background(), collectionId)

	if err != nil {
		return 0, err
	}

	asInt, ok := res.(int32)

	if !ok {
		return 0, ErrCollectionIndexCast
	}

	return asInt, nil
}

func (r *repository) getCollectionItem(collectionId string, poiId string) (db.CollectionItem, error) {
	res, err := r.di.Db.Queries.GetCollectionItem(context.Background(), db.GetCollectionItemParams{
		CollectionID: collectionId,
		PoiID:        poiId,
	})

	if err != nil {
		return db.CollectionItem{}, err
	}

	return res, nil
}

func (r *repository) deleteCollectionItemAtIndex(collectionId string, index int32) error {
	ctx := context.Background()
	tx, err := r.di.Db.Pool.Begin(ctx)

	if err != nil {
		return err
	}

	defer tx.Rollback(ctx)

	qtx := r.di.Db.Queries.WithTx(tx)

	err = qtx.DeleteCollectionItemAtIndex(ctx, db.DeleteCollectionItemAtIndexParams{
		CollectionID: collectionId,
		ListIndex:    index,
	})

	if err != nil {
		return err
	}

	// Decrement list index of all items after the deleted one
	err = qtx.DecrListIndexAfterDelete(ctx, db.DecrListIndexAfterDeleteParams{
		CollectionID: collectionId,
		ListIndex:    index,
	})

	if err != nil {
		return err
	}

	err = tx.Commit(ctx)

	if err != nil {
		return err
	}

	return nil
}

func (r *repository) updateCollectionItems(collectionId string, newOrderItems []NewOrderItem) error {
	ctx := context.Background()
	tx, err := r.di.Db.Pool.Begin(ctx)

	if err != nil {
		return err
	}

	defer tx.Rollback(ctx)

	qtx := r.di.Db.Queries.WithTx(tx)

	err = qtx.DeleteAllCollectionItems(ctx, collectionId)

	if err != nil {
		return err
	}

	for _, item := range newOrderItems {
		_, err = qtx.CreateCollectionItem(ctx, db.CreateCollectionItemParams{
			CollectionID: collectionId,
			PoiID:        item.PoiID,
			ListIndex:    item.ListIndex,
		})

		if err != nil {
			return err
		}
	}

	err = tx.Commit(ctx)

	if err != nil {
		return err
	}

	return nil
}

func (r *repository) createCollectionPoiRelation(id string, poiId string) error {
	return r.di.Db.Queries.CreateCollectionPoiRelation(context.Background(), db.CreateCollectionPoiRelationParams{
		CollectionID: id,
		PoiID:        poiId,
		Index:        0,
	})
}

func (r *repository) createCollectionCityRelation(id string, cityId int32) error {
	return r.di.Db.Queries.CreateCollectionCityRelation(context.Background(), db.CreateCollectionCityRelationParams{
		CollectionID: id,
		CityID:       cityId,
		Index:        0,
	})
}

func (r *repository) removeCollectionPoiRelation(id string, poiId string) error {
	return r.di.Db.Queries.RemoveCollectionPoiRelation(context.Background(), db.RemoveCollectionPoiRelationParams{
		CollectionID: id,
		PoiID:        poiId,
	})
}

func (r *repository) removeCollectionCityRelation(id string, cityId int32) error {
	return r.di.Db.Queries.RemoveCollectionCityRelation(context.Background(), db.RemoveCollectionCityRelationParams{
		CollectionID: id,
		CityID:       cityId,
	})
}

func (r *repository) getCollectionIdsForPoi(id string) ([]string, error) {
	return r.di.Db.Queries.GetCollectionIdsForPoi(context.Background(), id)
}

func (r *repository) getCollectionIdsForCity(id int32) ([]string, error) {
	return r.di.Db.Queries.GetCollectionsIdsForCity(context.Background(), id)
}

func (r *repository) getAllPoiCollections() ([]db.CollectionsPoi, error) {
	return r.di.Db.Queries.GetAllPoiCollections(context.Background())
}

func (r *repository) getAllCityCollections() ([]db.CollectionsCity, error) {
	return r.di.Db.Queries.GetAllCityCollections(context.Background())
}
