package reviews

func (s *service) createReview(userId string, dto CreateReviewRequestDto) (CreateReviewResponseDto, error) {
	res, err := s.repository.createReview(userId, dto)

	if err != nil {
		return CreateReviewResponseDto{}, err
	}

	v := mapToCreateReviewResponseDto(res)

	return v, nil
}
