package collections

import (
	"fmt"
	"wanderlust/internal/pkg/cache"
)

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
