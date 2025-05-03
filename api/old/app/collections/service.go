package collections

import (
	"fmt"
	"slices"
	"wanderlust/internal/pkg/cache"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/pagination"
)

func (s *service) getCollections(params pagination.Params) (GetCollectionsResponseDto, int64, error) {
	collections, err := s.repository.getCollections(params)

	if err != nil {
		return GetCollectionsResponseDto{}, 0, err
	}

	count, err := s.repository.countCollections()

	if err != nil {
		return GetCollectionsResponseDto{}, 0, err
	}

	dto := mapToGetCollectionsResponseDto(collections)

	return dto, count, nil
}

func (s *service) getCollectionById(id string) (GetCollectionByIdResponseDto, error) {
	collection, err := s.repository.getCollectionById(id)

	if err != nil {
		return GetCollectionByIdResponseDto{}, err
	}

	items, err := s.repository.getCollectionItems(id)

	if err != nil {
		return GetCollectionByIdResponseDto{}, err
	}

	dto := mapToGetCollectionByIdResponseDto(collection, items)

	return dto, nil
}

func (s *service) deleteCollection(id string) error {
	return s.repository.deleteCollection(id)
}

func (s *service) createCollection(dto CreateCollectionRequestDto) (GetCollectionByIdResponseDto, error) {
	collection, err := s.repository.createCollection(dto)

	if err != nil {
		return GetCollectionByIdResponseDto{}, err
	}

	resDto := mapToGetCollectionByIdResponseDto(collection, []db.GetCollectionItemsRow{})

	return resDto, nil
}

func (s *service) updateCollection(id string, dto UpdateCollectionRequestDto) error {
	return s.repository.updateCollection(id, dto)
}

func (s *service) getCollectionItems(id string) (GetCollectionItemsResponseDto, error) {
	items, err := s.repository.getCollectionItems(id)

	if err != nil {
		return GetCollectionItemsResponseDto{}, err
	}

	dto := mapToGetCollectionItemsResponseDto(items)

	return dto, nil
}

func (s *service) createCollectionItem(collectionId string, dto CreateCollectionItemRequestDto) (CreateCollectionItemResponseDto, error) {
	lastIndex, err := s.repository.getLastIndexOfCollection(collectionId)

	if err != nil {
		return CreateCollectionItemResponseDto{}, err
	}

	created, err := s.repository.createCollectionItem(collectionId, dto, lastIndex+1)

	if err != nil {
		return CreateCollectionItemResponseDto{}, err
	}

	resDto := mapToCreateCollectionItemResponseDto(created)

	return resDto, nil
}

func (s *service) deleteCollectionItem(collectionId string, poiId string) error {
	_, err := s.repository.getCollectionById(collectionId)

	if err != nil {
		return err
	}

	item, err := s.repository.getCollectionItem(collectionId, poiId)

	if err != nil {
		return err
	}

	return s.repository.deleteCollectionItemAtIndex(collectionId, item.ListIndex)
}

func (s *service) updateCollectionItems(collectionId string, dto UpdateCollectionItemsRequestDto) error {
	lastIndex, err := s.repository.getLastIndexOfCollection(collectionId)

	if err != nil {
		return err
	}

	if len(dto.NewOrder) != int(lastIndex) {
		return ErrInvalidOrder
	}

	for i := 1; i <= int(lastIndex); i++ {
		ok := slices.ContainsFunc(dto.NewOrder, func(item NewOrderItem) bool {
			return item.ListIndex == int32(i)
		})

		if !ok {
			return ErrInvalidOrder
		}
	}

	return s.repository.updateCollectionItems(collectionId, dto.NewOrder)
}

func (s *service) createCollectionPoiRelation(id string, poiId string) error {
	err := s.repository.createCollectionPoiRelation(id, poiId)

	if err != nil {
		return err
	}

	key := cache.KeyBuilder(cache.KeyCollectionGroup, "poi", poiId)
	_ = s.di.Cache.Del(key)

	return nil
}

func (s *service) createCollectionCityRelation(id string, cityId int32) error {
	err := s.repository.createCollectionCityRelation(id, cityId)

	if err != nil {
		return err
	}

	key := cache.KeyBuilder(cache.KeyCollectionGroup, "city", fmt.Sprintf("%d", cityId))
	_ = s.di.Cache.Del(key)

	return nil
}

func (s *service) removeCollectionPoiRelation(id string, poiId string) error {
	err := s.repository.removeCollectionPoiRelation(id, poiId)

	if err != nil {
		return err
	}

	key := cache.KeyBuilder(cache.KeyCollectionGroup, "poi", poiId)
	_ = s.di.Cache.Del(key)

	return nil
}

func (s *service) removeCollectionCityRelation(id string, cityId int32) error {
	err := s.repository.removeCollectionCityRelation(id, cityId)

	if err != nil {
		return err
	}

	key := cache.KeyBuilder(cache.KeyCollectionGroup, "city", fmt.Sprintf("%d", cityId))
	_ = s.di.Cache.Del(key)

	return nil
}

func (s *service) getCollectionsForPoi(id string) ([]GetCollectionByIdResponseDto, error) {
	key := cache.KeyBuilder(cache.KeyCollectionGroup, "poi", id)

	if s.di.Cache.Has(key) {
		var result []GetCollectionByIdResponseDto

		err := s.di.Cache.ReadObj(key, &result)

		if err == nil {
			return result, nil
		}
	}

	collectionIds, err := s.repository.getCollectionIdsForPoi(id)

	if err != nil {
		return nil, err
	}

	collections := make([]GetCollectionByIdResponseDto, 0)

	for _, collectionId := range collectionIds {
		collection, err := s.getCollectionById(collectionId)

		if err != nil {
			return nil, err
		}

		collections = append(collections, collection)
	}

	_ = s.di.Cache.SetObj(key, collections, cache.TTLCollectionGroup)

	return collections, nil
}

func (s *service) getCollectionsForCity(id int32) ([]GetCollectionByIdResponseDto, error) {
	key := cache.KeyBuilder(cache.KeyCollectionGroup, "city", fmt.Sprintf("%d", id))

	if s.di.Cache.Has(key) {
		var result []GetCollectionByIdResponseDto

		err := s.di.Cache.ReadObj(key, &result)

		if err == nil {
			return result, nil
		}
	}

	collectionIds, err := s.repository.getCollectionIdsForCity(id)

	if err != nil {
		return nil, err
	}

	collections := make([]GetCollectionByIdResponseDto, 0)

	for _, collectionId := range collectionIds {
		collection, err := s.getCollectionById(collectionId)

		if err != nil {
			return nil, err
		}

		collections = append(collections, collection)
	}

	_ = s.di.Cache.SetObj(key, collections, cache.TTLCollectionGroup)

	return collections, nil
}

func (s *service) getAllPoiCollections() ([]CollectionsPoiDto, error) {
	res, err := s.repository.getAllPoiCollections()

	if err != nil {
		return nil, err
	}

	v := mapToCollectionsPoiDto(res)

	return v, nil
}

func (s *service) getAllCityCollections() ([]CollectionsCityDto, error) {
	res, err := s.repository.getAllCityCollections()

	if err != nil {
		return nil, err
	}

	v := mapToCollectionsCityDto(res)

	return v, nil
}
