package collections

import (
	"context"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/pagination"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/uid"
)

type Service struct {
	repo *Repository
}

func (s *Service) list(ctx context.Context, params dto.PaginationQueryParams) (*dto.GetCollectionsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, count, err := s.repo.list(ctx, params)

	if err != nil {
		return nil, err
	}

	return &dto.GetCollectionsOutput{
		Body: dto.GetCollectionsOutputBody{
			Collections: res,
			Pagination:  pagination.Compute(params, count),
		},
	}, nil
}

func (s *Service) get(ctx context.Context, id string) (*dto.GetCollectionByIdOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	collection, err := s.repo.find(ctx, id)

	if err != nil {
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

	res, err := s.repo.create(ctx, CreateParams{
		ID:          uid.Flake(),
		Name:        body.Name,
		Description: body.Description,
	})

	if err != nil {
		return nil, err
	}

	return &dto.CreateCollectionOutput{
		Body: dto.CreateCollectionOutputBody{
			Collection: *res,
		},
	}, nil
}

func (s *Service) remove(ctx context.Context, id string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	_, err := s.repo.find(ctx, id)

	if err != nil {
		return err
	}

	return s.repo.remove(ctx, id)
}

func (s *Service) update(ctx context.Context, id string, body dto.UpdateCollectionInputBody) (*dto.UpdateCollectionOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	_, err := s.repo.find(ctx, id)

	if err != nil {
		return nil, err
	}

	res, err := s.repo.update(ctx, UpdateParams{
		Name:        body.Name,
		Description: body.Description,
		ID:          id,
	})

	if err != nil {
		return nil, err
	}

	return &dto.UpdateCollectionOutput{
		Body: dto.UpdateCollectionOutputBody{
			Collection: *res,
		},
	}, nil
}

func (s *Service) createItem(ctx context.Context, collectionId string, body dto.CreateCollectionItemInputBody) (*dto.CreateCollectionItemOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.repo.createItem(ctx, collectionId, body.PoiID)

	if err != nil {
		return nil, err
	}

	return &dto.CreateCollectionItemOutput{
		Body: dto.CreateCollectionItemOutputBody{
			Collection: *res,
		},
	}, nil
}

func (s *Service) removeItem(ctx context.Context, collectionId string, index int32) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	return s.repo.removeItem(ctx, collectionId, index)
}

func (s *Service) updateItems(ctx context.Context, collectionId string, body dto.UpdateCollectionItemsInputBody) (*dto.UpdateCollectionItemsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.repo.updateItems(ctx, collectionId, body)

	if err != nil {
		return nil, err
	}

	return &dto.UpdateCollectionItemsOutput{
		Body: dto.UpdateCollectionItemsOutputBody{
			Collection: *res,
		},
	}, nil
}

func (s *Service) createPoiRelation(ctx context.Context, collectionId string, poiId string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	return s.repo.createPoiRelation(ctx, collectionId, poiId)
}

func (s *Service) createCityRelation(ctx context.Context, collectionId string, cityId int32) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	return s.repo.createCityRelation(ctx, collectionId, cityId)
}

func (s *Service) removePoiRelation(ctx context.Context, collectionId string, poiId string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	return s.repo.removePoiRelation(ctx, collectionId, poiId)
}

func (s *Service) removeCityRelation(ctx context.Context, collectionId string, cityId int32) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	return s.repo.removeCityRelation(ctx, collectionId, cityId)
}

func (s *Service) listPoiCollections(ctx context.Context, poiId string) (*dto.GetCollectionsForPoiOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.repo.listPoiCollections(ctx, poiId)

	if err != nil {
		return nil, err
	}

	return &dto.GetCollectionsForPoiOutput{
		Body: dto.GetCollectionsForPoiOutputBody{
			Collections: res,
		},
	}, nil
}

func (s *Service) listCityCollections(ctx context.Context, cityId int32) (*dto.GetCollectionsForCityOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.repo.listCityCollections(ctx, cityId)

	if err != nil {
		return nil, err
	}

	return &dto.GetCollectionsForCityOutput{
		Body: dto.GetCollectionsForCityOutputBody{
			Collections: res,
		},
	}, nil
}

func (s *Service) listAllPoiCollections(ctx context.Context) (*dto.GetAllPoiCollectionsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.repo.listAllPoiCollections(ctx)

	if err != nil {
		return nil, err
	}

	return &dto.GetAllPoiCollectionsOutput{
		Body: dto.GetAllPoiCollectionsOutputBody{
			Collections: res,
		},
	}, nil
}

func (s *Service) listAllCityCollections(ctx context.Context) (*dto.GetAllCityCollectionsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.repo.listAllCityCollections(ctx)

	if err != nil {
		return nil, err
	}

	return &dto.GetAllCityCollectionsOutput{
		Body: dto.GetAllCityCollectionsOutputBody{
			Collections: res,
		},
	}, nil
}
