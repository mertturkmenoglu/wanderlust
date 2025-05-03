package aggregator

import "wanderlust/internal/pkg/cache"

func (s *service) checkCacheForHomeAggregation() (*HomeAggregatorResponseDto, error) {
	var cacheRes HomeAggregatorResponseDto

	err := s.di.Cache.ReadObj(cache.KeyHomeAggregations, &cacheRes)

	if err == nil {
		return &cacheRes, nil
	}

	return nil, err
}

func (s *service) getHomeAggregation() (HomeAggregatorResponseDto, error) {
	cacheRes, err := s.checkCacheForHomeAggregation()

	if err == nil {
		return *cacheRes, nil
	}

	dao, err := s.repository.getHomeAggregation()

	if err != nil {
		return HomeAggregatorResponseDto{}, err
	}

	dto := mapGetHomeAggregationDaoToDto(dao)

	err = s.di.Cache.SetObj(cache.KeyHomeAggregations, dto, cache.TTLHomeAggregations)

	if err != nil {
		return HomeAggregatorResponseDto{}, err
	}

	return dto, nil
}
