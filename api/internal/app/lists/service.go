package lists

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
