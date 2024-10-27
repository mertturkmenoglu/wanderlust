package diary

func (s *service) createNewDiaryEntry(userId string, dto CreateDiaryEntryRequestDto) (CreateDiaryEntryResponseDto, error) {
	res, err := s.repository.createNewDiaryEntry(userId, dto)

	if err != nil {
		return CreateDiaryEntryResponseDto{}, err
	}

	resDto := mapToCreateDiaryEntryResponseDto(res)

	return resDto, nil
}
