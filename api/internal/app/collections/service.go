package collections

import (
	"wanderlust/internal/db"
	"wanderlust/internal/pagination"
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
