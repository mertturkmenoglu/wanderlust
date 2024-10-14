package lists

import (
	"errors"
	"wanderlust/internal/pkg/pagination"

	"github.com/jackc/pgx/v5"
)

func (s *service) createList(dto CreateListRequestDto, userId string) (CreateListResponseDto, error) {
	res, err := s.repository.createList(dto, userId)

	if err != nil {
		return CreateListResponseDto{}, err
	}

	v := mapToCreateListResponseDto(res)

	return v, nil
}

func (s *service) getListById(id string) (GetListByIdResponseDto, error) {
	list, err := s.repository.getListById(id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return GetListByIdResponseDto{}, ErrListNotFound
		}

		return GetListByIdResponseDto{}, err
	}

	listItems, err := s.repository.getListItems(id)

	if err != nil {
		return GetListByIdResponseDto{}, err
	}

	v := mapToGetListByIdResponseDto(list, listItems)

	return v, nil
}

func (s *service) deleteList(id string) error {
	return s.repository.deleteList(id)
}

func (s *service) getAllListsOfUser(userId string, params pagination.Params) (GetAllListsOfUserDto, int64, error) {
	res, err := s.repository.getAllListsOfUser(userId, params)

	if err != nil {
		return GetAllListsOfUserDto{}, 0, err
	}

	count, err := s.repository.countListsOfUser(userId)

	if err != nil {
		return GetAllListsOfUserDto{}, 0, err
	}

	v := mapToGetAllListsOfUserDto(res)

	return v, count, nil
}

func (s *service) getPublicListsOfUser(username string, params pagination.Params) (GetPublicListsOfUserDto, int64, error) {
	userId, err := s.repository.getUserIdByUsername(username)

	if err != nil {
		return GetPublicListsOfUserDto{}, 0, ErrUserNotFound
	}

	res, err := s.repository.getPublicListsOfUser(userId, params)

	if err != nil {
		return GetPublicListsOfUserDto{}, 0, err
	}

	count, err := s.repository.countPublicListsOfUser(userId)

	if err != nil {
		return GetPublicListsOfUserDto{}, 0, err
	}

	v := mapToGetPublicListsOfUserDto(res)

	return v, count, nil
}

func (s *service) createListItem(listId string, poiId string) (CreateListItemResponseDto, error) {
	res, err := s.repository.addItemToEndOfList(listId, poiId)

	if err != nil {
		return CreateListItemResponseDto{}, err
	}

	v := mapToCreateListItemResponseDto(res)

	return v, nil
}

func (s *service) getListStatus(userId string, poiId string) (GetListStatusResponseDto, error) {
	res, err := s.repository.getListStatus(userId, poiId)

	if err != nil {
		return GetListStatusResponseDto{}, err
	}

	v := mapToGetListStatusResponseDto(res)

	return v, nil
}
