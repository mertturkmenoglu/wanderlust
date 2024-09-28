package favorites

func (s *service) createFavorite(poiId string, userId string) (CreateFavoriteResponseDto, error) {
	res, err := s.repository.createFavorite(poiId, userId)

	if err != nil {
		return CreateFavoriteResponseDto{}, err
	}

	v := mapCreateFavoriteResponseToDto(res)

	return v, nil
}

func (s *service) deleteFavoriteByPoiId(poiId string, userId string) error {
	return s.repository.deleteFavoriteByPoiId(poiId, userId)
}

func (s *service) getUserFavorites(userId string, offset int, limit int) (GetUserFavoritesResponseDto, int64, error) {
	res, err := s.repository.getUserFavorites(userId, offset, limit)

	if err != nil {
		return GetUserFavoritesResponseDto{}, 0, err
	}

	count, err := s.repository.countUserFavorites(userId)

	if err != nil {
		return GetUserFavoritesResponseDto{}, 0, err
	}

	v := mapGetUserFavoritessResponseToDto(res)

	return v, count, nil
}
