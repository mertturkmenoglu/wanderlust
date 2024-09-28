package bookmarks

func (s *service) createBookmark(poiId string, userId string) (CreateBookmarkResponseDto, error) {
	res, err := s.repository.createBookmark(poiId, userId)

	if err != nil {
		return CreateBookmarkResponseDto{}, err
	}

	v := mapCreateBookmarkResponseToDto(res)

	return v, nil
}

func (s *service) deleteBookmarkByPoiId(poiId string, userId string) error {
	return s.repository.deleteBookmarkByPoiId(poiId, userId)
}

func (s *service) getUserBookmarks(userId string, offset int, limit int) (GetUserBookmarksResponseDto, int64, error) {
	res, err := s.repository.getUserBookmarks(userId, offset, limit)

	if err != nil {
		return GetUserBookmarksResponseDto{}, 0, err
	}

	count, err := s.repository.countUserBookmarks(userId)

	if err != nil {
		return GetUserBookmarksResponseDto{}, 0, err
	}

	v := mapGetUserBookmarksResponseToDto(res)

	return v, count, nil
}
