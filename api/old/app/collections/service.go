package collections

import (
	"fmt"
	"wanderlust/internal/pkg/cache"
)

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
