package collections

import (
	"context"
	"errors"
	"slices"
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

func (s *Service) findMany(ctx context.Context, ids []string) ([]dto.Collection, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.db.GetCollections(ctx, ids)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get collections")
	}

	collections := make([]dto.Collection, len(res))

	for i, v := range res {
		res, err := mapper.ToCollection(v)

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to get collections")
		}

		collections[i] = res
	}

	return collections, nil
}

func (s *Service) find(ctx context.Context, id string) (*dto.Collection, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.findMany(ctx, []string{id})

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	if len(res) == 0 {
		err = huma.Error404NotFound("Collection not found")
		sp.RecordError(err)
		return nil, err
	}

	return &res[0], nil
}

func (s *Service) list(ctx context.Context, params dto.PaginationQueryParams) (*dto.GetCollectionsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	ids, err := s.db.GetCollectionIds(ctx, db.GetCollectionIdsParams{
		Offset: int32(pagination.GetOffset(params)),
		Limit:  int32(params.PageSize),
	})

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("Collections not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get collections")
	}

	collections, err := s.findMany(ctx, ids)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	count, err := s.db.CountCollections(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to count collections")
	}

	return &dto.GetCollectionsOutput{
		Body: dto.GetCollectionsOutputBody{
			Collections: collections,
			Pagination:  pagination.Compute(params, count),
		},
	}, nil
}

func (s *Service) get(ctx context.Context, id string) (*dto.GetCollectionByIdOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	collection, err := s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	return &dto.GetCollectionByIdOutput{
		Body: dto.GetCollectionByIdOutputBody{
			Collection: *collection,
		},
	}, nil
}

func (s *Service) create(ctx context.Context, body dto.CreateCollectionInputBody) (*dto.CreateCollectionOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbRes, err := s.db.CreateCollection(ctx, db.CreateCollectionParams{
		ID:          s.ID.Flake(),
		Name:        body.Name,
		Description: body.Description,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create collection")
	}

	collection, err := s.find(ctx, dbRes.ID)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get collection")
	}

	return &dto.CreateCollectionOutput{
		Body: dto.CreateCollectionOutputBody{
			Collection: *collection,
		},
	}, nil
}

func (s *Service) remove(ctx context.Context, id string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	_, err := s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return err
	}

	err = s.db.DeleteCollection(ctx, id)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return huma.Error404NotFound("Collection not found")
		}

		return huma.Error500InternalServerError("Failed to delete collection")
	}

	return nil
}

func (s *Service) update(ctx context.Context, id string, body dto.UpdateCollectionInputBody) (*dto.UpdateCollectionOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	_, err := s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	err = s.db.UpdateCollection(ctx, db.UpdateCollectionParams{
		Name:        body.Name,
		Description: body.Description,
		ID:          id,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to update collection")
	}

	collection, err := s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get collection")
	}

	return &dto.UpdateCollectionOutput{
		Body: dto.UpdateCollectionOutputBody{
			Collection: *collection,
		},
	}, nil
}

func (s *Service) createItem(ctx context.Context, collectionId string, body dto.CreateCollectionItemInputBody) (*dto.CreateCollectionItemOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.db.GetLastIndexOfCollection(ctx, collectionId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get last index of collection")
	}

	asInt, ok := res.(int32)

	if !ok {
		err = huma.Error500InternalServerError("Failed to cast last index of collection")
		sp.RecordError(err)
		return nil, err
	}

	_, err = s.db.CreateCollectionItem(ctx, db.CreateCollectionItemParams{
		CollectionID: collectionId,
		PoiID:        body.PoiID,
		Index:        asInt + 1,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create collection item")
	}

	collection, err := s.find(ctx, collectionId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get collection")
	}

	return &dto.CreateCollectionItemOutput{
		Body: dto.CreateCollectionItemOutputBody{
			Collection: *collection,
		},
	}, nil
}

func (s *Service) removeItem(ctx context.Context, collectionId string, index int32) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tx, err := s.pool.Begin(ctx)

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("Failed to create transaction")
	}

	defer tx.Rollback(ctx)

	qtx := s.db.WithTx(tx)

	err = qtx.DeleteCollectionItemAtIndex(ctx, db.DeleteCollectionItemAtIndexParams{
		CollectionID: collectionId,
		Index:        index,
	})

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("Failed to delete collection item")
	}

	// Decrement list index of all items after the deleted one
	err = qtx.DecrListIndexAfterDelete(ctx, db.DecrListIndexAfterDeleteParams{
		CollectionID: collectionId,
		Index:        index,
	})

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("Failed to decrement list index of collection items")
	}

	err = tx.Commit(ctx)

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("Failed to commit transaction")
	}

	return nil
}

func (s *Service) updateItems(ctx context.Context, collectionId string, body dto.UpdateCollectionItemsInputBody) (*dto.UpdateCollectionItemsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.db.GetLastIndexOfCollection(ctx, collectionId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get last index of collection")
	}

	lastIndex, ok := res.(int32)

	if !ok {
		err = huma.Error500InternalServerError("Failed to cast last index of collection")
		sp.RecordError(err)
		return nil, err
	}

	if len(body.NewOrder) != int(lastIndex) {
		err = huma.Error422UnprocessableEntity("Invalid order")
		sp.RecordError(err)
		return nil, err
	}

	var i int32

	for i = 1; i <= lastIndex; i++ {
		ok := slices.ContainsFunc(body.NewOrder, func(item dto.NewOrderItem) bool {
			return item.ListIndex == int32(i)
		})

		if !ok {
			err = huma.Error422UnprocessableEntity("Invalid order")
			sp.RecordError(err)
			return nil, err
		}
	}

	tx, err := s.pool.Begin(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create transaction")
	}

	defer tx.Rollback(ctx)

	qtx := s.db.WithTx(tx)

	err = qtx.DeleteAllCollectionItems(ctx, collectionId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to delete all collection items")
	}

	for _, item := range body.NewOrder {
		_, err = qtx.CreateCollectionItem(ctx, db.CreateCollectionItemParams{
			CollectionID: collectionId,
			PoiID:        item.PoiID,
			Index:        item.ListIndex,
		})

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to create collection item")
		}
	}

	err = tx.Commit(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to commit transaction")
	}

	collection, err := s.find(ctx, collectionId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get collection")
	}

	return &dto.UpdateCollectionItemsOutput{
		Body: dto.UpdateCollectionItemsOutputBody{
			Collection: *collection,
		},
	}, nil
}

func (s *Service) createPoiRelation(ctx context.Context, collectionId string, poiId string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	err := s.db.CreateCollectionPoiRelation(ctx, db.CreateCollectionPoiRelationParams{
		CollectionID: collectionId,
		PoiID:        poiId,
		Index:        0,
	})

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("Failed to create collection POI relation")
	}

	return nil
}

func (s *Service) createCityRelation(ctx context.Context, collectionId string, cityId int32) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	err := s.db.CreateCollectionCityRelation(ctx, db.CreateCollectionCityRelationParams{
		CollectionID: collectionId,
		CityID:       cityId,
		Index:        0,
	})

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("Failed to create collection city relation")
	}

	return nil
}

func (s *Service) removePoiRelation(ctx context.Context, collectionId string, poiId string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	err := s.db.RemoveCollectionPoiRelation(ctx, db.RemoveCollectionPoiRelationParams{
		CollectionID: collectionId,
		PoiID:        poiId,
	})

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("Failed to remove collection POI relation")
	}

	return nil
}

func (s *Service) removeCityRelation(ctx context.Context, collectionId string, cityId int32) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	err := s.db.RemoveCollectionCityRelation(ctx, db.RemoveCollectionCityRelationParams{
		CollectionID: collectionId,
		CityID:       cityId,
	})

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("Failed to remove collection city relation")
	}

	return nil
}

func (s *Service) getCollectionsForPoi(ctx context.Context, poiId string) (*dto.GetCollectionsForPoiOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	collectionIds, err := s.db.GetCollectionIdsForPoi(ctx, poiId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get collections for poi")
	}

	res, err := s.findMany(ctx, collectionIds)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get collections for poi")
	}

	return &dto.GetCollectionsForPoiOutput{
		Body: dto.GetCollectionsForPoiOutputBody{
			Collections: res,
		},
	}, nil
}

func (s *Service) getCollectionsForCity(ctx context.Context, cityId int32) (*dto.GetCollectionsForCityOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	collectionIds, err := s.db.GetCollectionsIdsForCity(ctx, cityId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get collections for city")
	}

	res, err := s.findMany(ctx, collectionIds)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get collections for city")
	}

	return &dto.GetCollectionsForCityOutput{
		Body: dto.GetCollectionsForCityOutputBody{
			Collections: res,
		},
	}, nil
}

func (s *Service) getAllPoiCollections(ctx context.Context) (*dto.GetAllPoiCollectionsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.db.GetAllPoiCollections(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get all POI collections")
	}

	ids := make([]string, len(res))

	for i, v := range res {
		ids[i] = v.CollectionID
	}

	collections, err := s.findMany(ctx, ids)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get all POI collections")
	}

	return &dto.GetAllPoiCollectionsOutput{
		Body: dto.GetAllPoiCollectionsOutputBody{
			Collections: collections,
		},
	}, nil
}

func (s *Service) getAllCityCollections(ctx context.Context) (*dto.GetAllCityCollectionsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.db.GetAllCityCollections(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get all city collections")
	}

	ids := make([]string, len(res))

	for i, v := range res {
		ids[i] = v.CollectionID
	}

	collections, err := s.findMany(ctx, ids)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get all city collections")
	}

	return &dto.GetAllCityCollectionsOutput{
		Body: dto.GetAllCityCollectionsOutputBody{
			Collections: collections,
		},
	}, nil
}
