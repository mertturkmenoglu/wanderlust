package lists

func (s *service) createList(dto CreateListRequestDto, userId string) (CreateListResponseDto, error) {
	res, err := s.repository.createList(dto, userId)

	if err != nil {
		return CreateListResponseDto{}, err
	}

	v := mapToCreateListResponseDto(res)

	return v, nil
}