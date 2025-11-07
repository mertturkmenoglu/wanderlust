package collections

import (
	"context"
	"fmt"
	"slices"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/pagination"
	"wanderlust/pkg/tracing"

	"github.com/cockroachdb/errors"
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

	res, err := r.db.FindManyCollections(ctx, ids)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.Wrap(ErrNoCollectionFound, err.Error())
		}

		return nil, errors.Wrap(ErrFailedToList, err.Error())
	}

	collections := make([]dto.Collection, len(res))

	for i, row := range res {
		val, err := dto.ToCollection(row)

		if err != nil {
			return nil, errors.Wrap(ErrFailedToList, err.Error())
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

	ids, err := r.db.FindManyCollectionIds(ctx, db.FindManyCollectionIdsParams{
		Offset: int32(pagination.GetOffset(page)),
		Limit:  int32(page.PageSize),
	})

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, 0, errors.Wrap(ErrNoCollectionFound, err.Error())
		}

		return nil, 0, errors.Wrap(ErrFailedToList, err.Error())
	}

	collections, err := r.findMany(ctx, ids)

	if err != nil {
		return nil, 0, err
	}

	count, err := r.db.CountCollections(ctx)

	if err != nil {
		return nil, 0, errors.Wrap(ErrFailedToCount, err.Error())
	}

	return collections, count, nil
}

type CreateParams = db.CreateCollectionParams

func (r *Repository) create(ctx context.Context, params CreateParams) (*dto.Collection, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.CreateCollection(ctx, params)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToCreate, err.Error())
	}

	collection, err := r.find(ctx, res.ID)

	if err != nil {
		return nil, err
	}

	return collection, nil
}

func (r *Repository) remove(ctx context.Context, id string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tag, err := r.db.RemoveCollectionById(ctx, id)

	if err != nil {
		return errors.Wrap(ErrFailedToDelete, err.Error())
	}

	if tag.RowsAffected() == 0 {
		return ErrNotFound
	}

	return nil
}

type UpdateParams = db.UpdateCollectionParams

func (r *Repository) update(ctx context.Context, params UpdateParams) (*dto.Collection, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	_, err := r.db.UpdateCollection(ctx, params)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToUpdate, err.Error())
	}

	return r.find(ctx, params.ID)
}

func (r *Repository) createItem(ctx context.Context, collectionId string, placeId string) (*dto.Collection, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.FindCollectionLastIndexById(ctx, collectionId)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToCreateItem, err.Error())
	}

	asInt, ok := res.(int32)

	if !ok {
		return nil, errors.Wrap(ErrFailedToCreateItem, err.Error())
	}

	_, err = r.db.CreateCollectionItem(ctx, db.CreateCollectionItemParams{
		CollectionID: collectionId,
		PlaceID:      placeId,
		Index:        asInt + 1,
	})

	if err != nil {
		return nil, errors.Wrap(ErrFailedToCreateItem, err.Error())
	}

	return r.find(ctx, collectionId)
}

func (r *Repository) removeItem(ctx context.Context, collectionId string, index int32) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tx, err := r.pool.Begin(ctx)

	if err != nil {
		return errors.Wrap(ErrFailedToDeleteItem, err.Error())
	}

	defer tx.Rollback(ctx)

	qtx := r.db.WithTx(tx)

	tag, err := qtx.RemoveCollectionItemByCollectionIdAndIndex(ctx, db.RemoveCollectionItemByCollectionIdAndIndexParams{
		CollectionID: collectionId,
		Index:        index,
	})

	if err != nil {
		return errors.Wrap(ErrFailedToDeleteItem, err.Error())
	}

	if tag.RowsAffected() == 0 {
		return ErrItemNotFound
	}

	_, err = qtx.DecrementCollectionIndexAfterDelete(ctx, db.DecrementCollectionIndexAfterDeleteParams{
		CollectionID: collectionId,
		Index:        index,
	})

	if err != nil {
		return errors.Wrap(ErrFailedToDeleteItem, err.Error())
	}

	err = tx.Commit(ctx)

	if err != nil {
		return errors.Wrap(ErrFailedToDeleteItem, err.Error())
	}

	return nil
}

func (r *Repository) updateItems(ctx context.Context, collectionId string, data UpdateCollectionItemsInputBody) (*dto.Collection, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.FindCollectionLastIndexById(ctx, collectionId)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToUpdateItems, err.Error())
	}

	lastIndex, ok := res.(int32)

	if !ok {
		return nil, errors.Wrap(ErrFailedToUpdateItems, fmt.Sprintf("invalid type %T", res))
	}

	if len(data.NewOrder) != int(lastIndex) {
		return nil, ErrInvalidItemOrder
	}

	var i int32

	for i = 1; i <= lastIndex; i++ {
		ok := slices.ContainsFunc(data.NewOrder, func(item NewOrderItem) bool {
			return item.ListIndex == int32(i)
		})

		if !ok {
			return nil, ErrInvalidItemOrder
		}
	}

	tx, err := r.pool.Begin(ctx)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToUpdateItems, err.Error())
	}

	defer tx.Rollback(ctx)

	qtx := r.db.WithTx(tx)

	_, err = qtx.RemoveCollectionItemsByCollectionId(ctx, collectionId)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToUpdateItems, err.Error())
	}

	for _, item := range data.NewOrder {
		_, err = qtx.CreateCollectionItem(ctx, db.CreateCollectionItemParams{
			CollectionID: collectionId,
			PlaceID:      item.PlaceId,
			Index:        item.ListIndex,
		})

		if err != nil {
			return nil, errors.Wrap(ErrFailedToUpdateItems, err.Error())
		}
	}

	err = tx.Commit(ctx)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToUpdateItems, err.Error())
	}

	return r.find(ctx, collectionId)
}

func (r *Repository) createPlaceRelation(ctx context.Context, collectionId string, placeId string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	_, err := r.db.CreateCollectionPlaceRelation(ctx, db.CreateCollectionPlaceRelationParams{
		CollectionID: collectionId,
		PlaceID:      placeId,
		Index:        0,
	})

	if err != nil {
		return errors.Wrap(ErrFailedToCreatePlaceRelation, err.Error())
	}

	return nil
}

func (r *Repository) createCityRelation(ctx context.Context, collectionId string, cityId int32) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	_, err := r.db.CreateCollectionCityRelation(ctx, db.CreateCollectionCityRelationParams{
		CollectionID: collectionId,
		CityID:       cityId,
		Index:        0,
	})

	if err != nil {
		return errors.Wrap(ErrFailedToCreateCityRelation, err.Error())
	}

	return nil
}

func (r *Repository) removePlaceRelation(ctx context.Context, collectionId string, placeId string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	_, err := r.db.RemoveCollectionPlaceRelation(ctx, db.RemoveCollectionPlaceRelationParams{
		CollectionID: collectionId,
		PlaceID:      placeId,
	})

	if err != nil {
		return errors.Wrap(ErrFailedToDeletePlaceRelation, err.Error())
	}

	return nil
}

func (r *Repository) removeCityRelation(ctx context.Context, collectionId string, cityId int32) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	_, err := r.db.RemoveCollectionCityRelation(ctx, db.RemoveCollectionCityRelationParams{
		CollectionID: collectionId,
		CityID:       cityId,
	})

	if err != nil {
		return errors.Wrap(ErrFailedToDeleteCityRelation, err.Error())
	}

	return nil
}

func (r *Repository) listPlaceCollections(ctx context.Context, placeId string) ([]dto.Collection, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	ids, err := r.db.FindManyCollectionIdsByPlaceId(ctx, placeId)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToListPlaceCollections, err.Error())
	}

	return r.findMany(ctx, ids)
}

func (r *Repository) listCityCollections(ctx context.Context, cityId int32) ([]dto.Collection, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	ids, err := r.db.FindManyCollectionIdsByCityId(ctx, cityId)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToListCityCollections, err.Error())
	}

	return r.findMany(ctx, ids)
}

func (r *Repository) listAllPlaceCollections(ctx context.Context) ([]dto.Collection, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.FindManyCollectionPlaceRelations(ctx)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToListAllPlaceCollections, err.Error())
	}

	ids := make([]string, len(res))

	for i, v := range res {
		ids[i] = v.CollectionID
	}

	return r.findMany(ctx, ids)
}

func (r *Repository) listAllCityCollections(ctx context.Context) ([]dto.Collection, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.FindManyCollectionCityRelations(ctx)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToListAllCityCollections, err.Error())
	}

	ids := make([]string, len(res))

	for i, v := range res {
		ids[i] = v.CollectionID
	}

	return r.findMany(ctx, ids)
}
