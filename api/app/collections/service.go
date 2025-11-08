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

func (s *Service) list(ctx context.Context, params dto.PaginationQueryParams) (*GetCollectionsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, count, err := s.repo.list(ctx, params)

	if err != nil {
		return nil, err
	}

	return &GetCollectionsOutput{
		Body: GetCollectionsOutputBody{
			Collections: res,
			Pagination:  pagination.Compute(params, count),
		},
	}, nil
}

func (s *Service) get(ctx context.Context, id string) (*GetCollectionByIdOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	collection, err := s.repo.find(ctx, id)

	if err != nil {
		return nil, err
	}

	return &GetCollectionByIdOutput{
		Body: GetCollectionByIdOutputBody{
			Collection: *collection,
		},
	}, nil
}

func (s *Service) create(ctx context.Context, body CreateCollectionInputBody) (*CreateCollectionOutput, error) {
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

	return &CreateCollectionOutput{
		Body: CreateCollectionOutputBody{
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

func (s *Service) update(ctx context.Context, id string, body UpdateCollectionInputBody) (*UpdateCollectionOutput, error) {
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

	return &UpdateCollectionOutput{
		Body: UpdateCollectionOutputBody{
			Collection: *res,
		},
	}, nil
}

func (s *Service) createItem(ctx context.Context, collectionId string, body CreateCollectionItemInputBody) (*CreateCollectionItemOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.repo.createItem(ctx, collectionId, body.PlaceID)

	if err != nil {
		return nil, err
	}

	return &CreateCollectionItemOutput{
		Body: CreateCollectionItemOutputBody{
			Collection: *res,
		},
	}, nil
}

func (s *Service) removeItem(ctx context.Context, collectionId string, index int32) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	return s.repo.removeItem(ctx, collectionId, index)
}

func (s *Service) updateItems(ctx context.Context, collectionId string, body UpdateCollectionItemsInputBody) (*UpdateCollectionItemsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.repo.updateItems(ctx, collectionId, body)

	if err != nil {
		return nil, err
	}

	return &UpdateCollectionItemsOutput{
		Body: UpdateCollectionItemsOutputBody{
			Collection: *res,
		},
	}, nil
}

func (s *Service) createPlaceRelation(ctx context.Context, collectionId string, placeId string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	return s.repo.createPlaceRelation(ctx, collectionId, placeId)
}

func (s *Service) createCityRelation(ctx context.Context, collectionId string, cityId int32) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	return s.repo.createCityRelation(ctx, collectionId, cityId)
}

func (s *Service) removePlaceRelation(ctx context.Context, collectionId string, placeId string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	return s.repo.removePlaceRelation(ctx, collectionId, placeId)
}

func (s *Service) removeCityRelation(ctx context.Context, collectionId string, cityId int32) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	return s.repo.removeCityRelation(ctx, collectionId, cityId)
}

func (s *Service) listPlaceCollections(ctx context.Context, placeId string) (*GetCollectionsForPlaceOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.repo.listPlaceCollections(ctx, placeId)

	if err != nil {
		return nil, err
	}

	return &GetCollectionsForPlaceOutput{
		Body: GetCollectionsForPlaceOutputBody{
			Collections: res,
		},
	}, nil
}

func (s *Service) listCityCollections(ctx context.Context, cityId int32) (*GetCollectionsForCityOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.repo.listCityCollections(ctx, cityId)

	if err != nil {
		return nil, err
	}

	return &GetCollectionsForCityOutput{
		Body: GetCollectionsForCityOutputBody{
			Collections: res,
		},
	}, nil
}

func (s *Service) listAllPlaceCollections(ctx context.Context) (*GetAllPlaceCollectionsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.repo.listAllPlaceCollections(ctx)

	if err != nil {
		return nil, err
	}

	return &GetAllPlaceCollectionsOutput{
		Body: GetAllPlaceCollectionsOutputBody{
			Collections: res,
		},
	}, nil
}

func (s *Service) listAllCityCollections(ctx context.Context) (*GetAllCityCollectionsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.repo.listAllCityCollections(ctx)

	if err != nil {
		return nil, err
	}

	return &GetAllCityCollectionsOutput{
		Body: GetAllCityCollectionsOutputBody{
			Collections: res,
		},
	}, nil
}
