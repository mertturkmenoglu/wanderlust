package collections

import (
	"context"
	"errors"
	"slices"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/dto"
	"wanderlust/internal/pkg/mapper"
	"wanderlust/internal/pkg/pagination"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
)

type Service struct {
	app *core.Application
}

func (s *Service) getMany(ids []string) ([]dto.Collection, error) {
	res, err := s.app.Db.Queries.GetCollectionsByIdsPopulated(context.Background(), ids)

	if err != nil {
		return nil, err
	}

	collections := make([]dto.Collection, len(res))

	for i, v := range res {
		v, err := mapper.ToCollection(v)

		if err != nil {
			return nil, err
		}

		collections[i] = v
	}

	return collections, nil
}

func (s *Service) get(id string) (*dto.Collection, error) {
	res, err := s.getMany([]string{id})

	if err != nil {
		return nil, err
	}

	if len(res) == 0 {
		return nil, huma.Error404NotFound("Collection not found")
	}

	return &res[0], nil
}

func (s *Service) list(params dto.PaginationQueryParams) (*dto.GetCollectionsOutput, error) {
	dbRes, err := s.app.Db.Queries.GetCollections(context.Background(), db.GetCollectionsParams{
		Offset: int32(pagination.GetOffset(params)),
		Limit:  int32(params.PageSize),
	})

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("Collections not found")
		}

		return nil, huma.Error500InternalServerError("failed to get collections")
	}

	ids := make([]string, len(dbRes))

	for i, v := range dbRes {
		ids[i] = v.ID
	}

	collections, err := s.getMany(ids)

	if err != nil {
		return nil, err
	}

	count, err := s.app.Db.Queries.CountCollections(context.Background())

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to count collections")
	}

	return &dto.GetCollectionsOutput{
		Body: dto.GetCollectionsOutputBody{
			Collections: collections,
			Pagination:  pagination.Compute(params, count),
		},
	}, nil
}

func (s *Service) getById(id string) (*dto.GetCollectionByIdOutput, error) {
	collection, err := s.get(id)

	if err != nil {
		return nil, err
	}

	return &dto.GetCollectionByIdOutput{
		Body: dto.GetCollectionByIdOutputBody{
			Collection: *collection,
		},
	}, nil
}

func (s *Service) create(body dto.CreateCollectionInputBody) (*dto.CreateCollectionOutput, error) {
	dbRes, err := s.app.Db.Queries.CreateCollection(context.Background(), db.CreateCollectionParams{
		Name:        body.Name,
		Description: body.Description,
	})

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to create collection")
	}

	collection, err := s.get(dbRes.ID)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to get collection")
	}

	return &dto.CreateCollectionOutput{
		Body: dto.CreateCollectionOutputBody{
			Collection: *collection,
		},
	}, nil
}

func (s *Service) remove(id string) error {
	return s.app.Db.Queries.DeleteCollection(context.Background(), id)
}

func (s *Service) update(id string, body dto.UpdateCollectionInputBody) (*dto.UpdateCollectionOutput, error) {
	err := s.app.Db.Queries.UpdateCollection(context.Background(), db.UpdateCollectionParams{
		Name:        body.Name,
		Description: body.Description,
		ID:          id,
	})

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to update collection")
	}

	collection, err := s.get(id)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to get collection")
	}

	return &dto.UpdateCollectionOutput{
		Body: dto.UpdateCollectionOutputBody{
			Collection: *collection,
		},
	}, nil
}

func (s *Service) createItem(collectionId string, body dto.CreateCollectionItemInputBody) (*dto.CreateCollectionItemOutput, error) {
	res, err := s.app.Db.Queries.GetLastIndexOfCollection(context.Background(), collectionId)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to get last index of collection")
	}

	asInt, ok := res.(int32)

	if !ok {
		return nil, huma.Error500InternalServerError("failed to cast last index of collection")
	}

	_, err = s.app.Db.Queries.CreateCollectionItem(context.Background(), db.CreateCollectionItemParams{
		CollectionID: collectionId,
		PoiID:        body.PoiID,
		ListIndex:    asInt + 1,
	})

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to create collection item")
	}

	collection, err := s.get(collectionId)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to get collection")
	}

	return &dto.CreateCollectionItemOutput{
		Body: dto.CreateCollectionItemOutputBody{
			Collection: *collection,
		},
	}, nil
}

func (s *Service) removeItem(collectionId string, index int32) error {
	ctx := context.Background()
	tx, err := s.app.Db.Pool.Begin(ctx)

	if err != nil {
		return huma.Error500InternalServerError("failed to create transaction")
	}

	defer tx.Rollback(ctx)

	qtx := s.app.Db.Queries.WithTx(tx)

	err = qtx.DeleteCollectionItemAtIndex(ctx, db.DeleteCollectionItemAtIndexParams{
		CollectionID: collectionId,
		ListIndex:    index,
	})

	if err != nil {
		return huma.Error500InternalServerError("failed to delete collection item")
	}

	// Decrement list index of all items after the deleted one
	err = qtx.DecrListIndexAfterDelete(ctx, db.DecrListIndexAfterDeleteParams{
		CollectionID: collectionId,
		ListIndex:    index,
	})

	if err != nil {
		return huma.Error500InternalServerError("failed to decrement list index of collection items")
	}

	err = tx.Commit(ctx)

	if err != nil {
		return huma.Error500InternalServerError("failed to commit transaction")
	}

	return nil
}

func (s *Service) updateItems(collectionId string, body dto.UpdateCollectionItemsInputBody) (*dto.UpdateCollectionItemsOutput, error) {
	res, err := s.app.Db.Queries.GetLastIndexOfCollection(context.Background(), collectionId)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to get last index of collection")
	}

	lastIndex, ok := res.(int32)

	if !ok {
		return nil, huma.Error500InternalServerError("failed to cast last index of collection")
	}

	if len(body.NewOrder) != int(lastIndex) {
		return nil, huma.Error422UnprocessableEntity("invalid order")
	}

	for i := 1; i <= int(lastIndex); i++ {
		ok := slices.ContainsFunc(body.NewOrder, func(item dto.NewOrderItem) bool {
			return item.ListIndex == int32(i)
		})

		if !ok {
			return nil, huma.Error422UnprocessableEntity("invalid order")
		}
	}

	ctx := context.Background()
	tx, err := s.app.Db.Pool.Begin(ctx)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to create transaction")
	}

	defer tx.Rollback(ctx)

	qtx := s.app.Db.Queries.WithTx(tx)

	err = qtx.DeleteAllCollectionItems(ctx, collectionId)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to delete all collection items")
	}

	for _, item := range body.NewOrder {
		_, err = qtx.CreateCollectionItem(ctx, db.CreateCollectionItemParams{
			CollectionID: collectionId,
			PoiID:        item.PoiID,
			ListIndex:    item.ListIndex,
		})

		if err != nil {
			return nil, huma.Error500InternalServerError("failed to create collection item")
		}
	}

	err = tx.Commit(ctx)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to commit transaction")
	}

	collection, err := s.get(collectionId)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to get collection")
	}

	return &dto.UpdateCollectionItemsOutput{
		Body: dto.UpdateCollectionItemsOutputBody{
			Collection: *collection,
		},
	}, nil
}

func (s *Service) createPoiRelation(collectionId string, poiId string) error {
	err := s.app.Db.Queries.CreateCollectionPoiRelation(context.Background(), db.CreateCollectionPoiRelationParams{
		CollectionID: collectionId,
		PoiID:        poiId,
		Index:        0,
	})

	if err != nil {
		return huma.Error500InternalServerError("failed to create collection POI relation")
	}

	return nil
}

func (s *Service) createCityRelation(collectionId string, cityId int32) error {
	err := s.app.Db.Queries.CreateCollectionCityRelation(context.Background(), db.CreateCollectionCityRelationParams{
		CollectionID: collectionId,
		CityID:       cityId,
		Index:        0,
	})

	if err != nil {
		return huma.Error500InternalServerError("failed to create collection city relation")
	}

	return nil
}

func (s *Service) removePoiRelation(collectionId string, poiId string) error {
	err := s.app.Db.Queries.RemoveCollectionPoiRelation(context.Background(), db.RemoveCollectionPoiRelationParams{
		CollectionID: collectionId,
		PoiID:        poiId,
	})

	if err != nil {
		return huma.Error500InternalServerError("failed to remove collection POI relation")
	}

	return nil
}

func (s *Service) removeCityRelation(collectionId string, cityId int32) error {
	err := s.app.Db.Queries.RemoveCollectionCityRelation(context.Background(), db.RemoveCollectionCityRelationParams{
		CollectionID: collectionId,
		CityID:       cityId,
	})

	if err != nil {
		return huma.Error500InternalServerError("failed to remove collection city relation")
	}

	return nil
}

func (s *Service) getCollectionsForPoi(poiId string) (*dto.GetCollectionsForPoiOutput, error) {
	collectionIds, err := s.app.Db.Queries.GetCollectionIdsForPoi(context.Background(), poiId)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to get collections for poi")
	}

	res, err := s.getMany(collectionIds)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to get collections for poi")
	}

	return &dto.GetCollectionsForPoiOutput{
		Body: dto.GetCollectionsForPoiOutputBody{
			Collections: res,
		},
	}, nil
}

func (s *Service) getCollectionsForCity(cityId int32) (*dto.GetCollectionsForCityOutput, error) {
	collectionIds, err := s.app.Db.Queries.GetCollectionsIdsForCity(context.Background(), cityId)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to get collections for city")
	}

	res, err := s.getMany(collectionIds)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to get collections for city")
	}

	return &dto.GetCollectionsForCityOutput{
		Body: dto.GetCollectionsForCityOutputBody{
			Collections: res,
		},
	}, nil
}

func (s *Service) getAllPoiCollections() (*dto.GetAllPoiCollectionsOutput, error) {
	res, err := s.app.Db.Queries.GetAllPoiCollections(context.Background())

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to get all POI collections")
	}

	ids := make([]string, len(res))

	for i, v := range res {
		ids[i] = v.CollectionID
	}

	collections, err := s.getMany(ids)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to get all POI collections")
	}

	return &dto.GetAllPoiCollectionsOutput{
		Body: dto.GetAllPoiCollectionsOutputBody{
			Collections: collections,
		},
	}, nil
}

func (s *Service) getAllCityCollections() (*dto.GetAllCityCollectionsOutput, error) {
	res, err := s.app.Db.Queries.GetAllCityCollections(context.Background())

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to get all city collections")
	}

	ids := make([]string, len(res))

	for i, v := range res {
		ids[i] = v.CollectionID
	}

	collections, err := s.getMany(ids)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to get all city collections")
	}

	return &dto.GetAllCityCollectionsOutput{
		Body: dto.GetAllCityCollectionsOutputBody{
			Collections: collections,
		},
	}, nil
}
