package collections

import (
	"context"
	"errors"
	"fmt"
	"slices"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mapper"
	"wanderlust/pkg/pagination"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	db   *db.Queries
	pool *pgxpool.Pool
}

func (r *Repository) findMany(ctx context.Context, ids []string) ([]dto.Collection, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.GetCollections(ctx, ids)

	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, ErrNoCollectionFound
		}

		return nil, ErrFailedToList
	}

	collections := make([]dto.Collection, len(res))

	for i, row := range res {
		val, err := mapper.ToCollection(row)

		if err != nil {
			return nil, ErrFailedToList
		}

		collections[i] = val
	}

	return collections, nil
}

func (r *Repository) find(ctx context.Context, id string) (*dto.Collection, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.findMany(ctx, []string{id})

	if err != nil {
		return nil, err
	}

	if len(res) == 0 {
		return nil, ErrNotFound
	}

	return &res[0], nil
}

func (r *Repository) list(ctx context.Context, page dto.PaginationQueryParams) ([]dto.Collection, int64, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	ids, err := r.db.GetCollectionIds(ctx, db.GetCollectionIdsParams{
		Offset: int32(pagination.GetOffset(page)),
		Limit:  int32(page.PageSize),
	})

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, 0, ErrNoCollectionFound
		}

		return nil, 0, ErrFailedToList
	}

	collections, err := r.findMany(ctx, ids)

	if err != nil {
		return nil, 0, err
	}

	count, err := r.db.CountCollections(ctx)

	if err != nil {
		return nil, 0, ErrFailedToCount
	}

	return collections, count, nil
}

type CreateParams = db.CreateCollectionParams

func (r *Repository) create(ctx context.Context, params CreateParams) (*dto.Collection, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.CreateCollection(ctx, params)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to create collection", err)
	}

	collection, err := r.find(ctx, res.ID)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to get collection", err)
	}

	return collection, nil
}

func (r *Repository) remove(ctx context.Context, id string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	err := r.db.DeleteCollection(ctx, id)

	if err != nil {
		return huma.Error500InternalServerError("Failed to delete collection", err)
	}

	return nil
}

type UpdateParams = db.UpdateCollectionParams

func (r *Repository) update(ctx context.Context, params UpdateParams) (*dto.Collection, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	err := r.db.UpdateCollection(ctx, params)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to update collection", err)
	}

	collection, err := r.find(ctx, params.ID)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to get collection", err)
	}

	return collection, nil
}

func (r *Repository) createItem(ctx context.Context, collectionId string, poiId string) (*dto.Collection, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.GetLastIndexOfCollection(ctx, collectionId)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to create item", err)
	}

	asInt, ok := res.(int32)

	if !ok {
		return nil, huma.Error500InternalServerError("Failed to create item", err)
	}

	_, err = r.db.CreateCollectionItem(ctx, db.CreateCollectionItemParams{
		CollectionID: collectionId,
		PoiID:        poiId,
		Index:        asInt + 1,
	})

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to create item", err)
	}

	collection, err := r.find(ctx, collectionId)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to get collection", err)
	}

	return collection, nil
}

func (r *Repository) removeItem(ctx context.Context, collectionId string, index int32) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tx, err := r.pool.Begin(ctx)

	if err != nil {
		return huma.Error500InternalServerError("Failed to remove item", err)
	}

	defer tx.Rollback(ctx)

	qtx := r.db.WithTx(tx)

	err = qtx.DeleteCollectionItemAtIndex(ctx, db.DeleteCollectionItemAtIndexParams{
		CollectionID: collectionId,
		Index:        index,
	})

	if err != nil {
		return huma.Error500InternalServerError("Failed to remove item", err)
	}

	err = qtx.DecrListIndexAfterDelete(ctx, db.DecrListIndexAfterDeleteParams{
		CollectionID: collectionId,
		Index:        index,
	})

	if err != nil {
		return huma.Error500InternalServerError("Failed to remove item", err)
	}

	err = tx.Commit(ctx)

	if err != nil {
		return huma.Error500InternalServerError("Failed to remove item", err)
	}

	return nil
}

func (r *Repository) updateItems(ctx context.Context, collectionId string, data dto.UpdateCollectionItemsInputBody) (*dto.Collection, error) {
	res, err := r.db.GetLastIndexOfCollection(ctx, collectionId)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to update items", err)
	}

	lastIndex, ok := res.(int32)

	if !ok {
		return nil, huma.Error500InternalServerError("Failed to update items", fmt.Errorf("invalid type %T", res))
	}

	if len(data.NewOrder) != int(lastIndex) {
		return nil, huma.Error422UnprocessableEntity("Invalid order")
	}

	var i int32

	for i = 1; i <= lastIndex; i++ {
		ok := slices.ContainsFunc(data.NewOrder, func(item dto.NewOrderItem) bool {
			return item.ListIndex == int32(i)
		})

		if !ok {
			return nil, huma.Error422UnprocessableEntity("Invalid order")
		}
	}

	tx, err := r.pool.Begin(ctx)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to update items", err)
	}

	defer tx.Rollback(ctx)

	qtx := r.db.WithTx(tx)

	err = qtx.DeleteAllCollectionItems(ctx, collectionId)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to update items", err)
	}

	for _, item := range data.NewOrder {
		_, err = qtx.CreateCollectionItem(ctx, db.CreateCollectionItemParams{
			CollectionID: collectionId,
			PoiID:        item.PoiID,
			Index:        item.ListIndex,
		})

		if err != nil {
			return nil, huma.Error500InternalServerError("Failed to update items", err)
		}
	}

	err = tx.Commit(ctx)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to update items", err)
	}

	collection, err := r.find(ctx, collectionId)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to get collection", err)
	}

	return collection, nil
}

func (r *Repository) createPoiRelation(ctx context.Context, collectionId string, poiId string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	err := r.db.CreateCollectionPoiRelation(ctx, db.CreateCollectionPoiRelationParams{
		CollectionID: collectionId,
		PoiID:        poiId,
		Index:        0,
	})

	if err != nil {
		return huma.Error500InternalServerError("Failed to create collection POI relation", err)
	}

	return nil
}

func (r *Repository) createCityRelation(ctx context.Context, collectionId string, cityId int32) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	err := r.db.CreateCollectionCityRelation(ctx, db.CreateCollectionCityRelationParams{
		CollectionID: collectionId,
		CityID:       cityId,
		Index:        0,
	})

	if err != nil {
		return huma.Error500InternalServerError("Failed to create collection city relation", err)
	}

	return nil
}

func (r *Repository) removePoiRelation(ctx context.Context, collectionId string, poiId string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	err := r.db.RemoveCollectionPoiRelation(ctx, db.RemoveCollectionPoiRelationParams{
		CollectionID: collectionId,
		PoiID:        poiId,
	})

	if err != nil {
		return huma.Error500InternalServerError("Failed to remove collection POI relation", err)
	}

	return nil
}

func (r *Repository) removeCityRelation(ctx context.Context, collectionId string, cityId int32) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	err := r.db.RemoveCollectionCityRelation(ctx, db.RemoveCollectionCityRelationParams{
		CollectionID: collectionId,
		CityID:       cityId,
	})

	if err != nil {
		return huma.Error500InternalServerError("Failed to remove collection city relation", err)
	}

	return nil
}

func (r *Repository) listPoiCollections(ctx context.Context, poiId string) ([]dto.Collection, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	collectionIds, err := r.db.GetCollectionIdsForPoi(ctx, poiId)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to list collections for POI", err)
	}

	res, err := r.findMany(ctx, collectionIds)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to list collections for POI", err)
	}

	return res, nil
}

func (r *Repository) listCityCollections(ctx context.Context, cityId int32) ([]dto.Collection, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	collectionIds, err := r.db.GetCollectionsIdsForCity(ctx, cityId)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to list collections for city", err)
	}

	res, err := r.findMany(ctx, collectionIds)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to list collections for city", err)
	}

	return res, nil
}

func (r *Repository) listAllPoiCollections(ctx context.Context) ([]dto.Collection, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.GetAllPoiCollections(ctx)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to get all POI collections", err)
	}

	ids := make([]string, len(res))

	for i, v := range res {
		ids[i] = v.CollectionID
	}

	collections, err := r.findMany(ctx, ids)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to get all POI collections", err)
	}

	return collections, nil
}

func (r *Repository) listAllCityCollections(ctx context.Context) ([]dto.Collection, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.GetAllCityCollections(ctx)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to get all city collections", err)
	}

	ids := make([]string, len(res))

	for i, v := range res {
		ids[i] = v.CollectionID
	}

	collections, err := r.findMany(ctx, ids)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to get all city collections", err)
	}

	return collections, nil
}
