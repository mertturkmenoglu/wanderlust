package aggregator

import (
	"context"
	"sync"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/tracing"

	"golang.org/x/sync/singleflight"
)

type Service struct {
	cacheMutex   sync.RWMutex
	requestGroup singleflight.Group
	cache        *cache.Cache
	repo         *Repository
}

func (s *Service) checkCacheForHomeAggregation(ctx context.Context) (*dto.HomeAggregatorOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	var res dto.HomeAggregatorOutput

	err := s.cache.ReadObj(ctx, cache.KeyHomeAggregations, &res)

	if err == nil {
		return &res, nil
	}

	return nil, err
}

func (s *Service) getHomeAggregation(ctx context.Context) (*dto.HomeAggregatorOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	s.cacheMutex.RLock()
	cacheRes, err := s.checkCacheForHomeAggregation(ctx)
	s.cacheMutex.RUnlock()

	if err == nil {
		return cacheRes, nil
	}

	result, err, _ := s.requestGroup.Do("home-aggregation", func() (any, error) {
		obj, err := s.repo.getHomeAggregation(ctx)

		if err != nil {
			sp.RecordError(err)
			return nil, err
		}

		s.cacheMutex.Lock()
		defer s.cacheMutex.Unlock()

		err = s.cache.Write(ctx, cache.KeyHomeAggregations, obj, cache.TTLHomeAggregations)

		if err != nil {
			sp.RecordError(err)
			return nil, err
		}

		return obj, nil
	})

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	return result.(*dto.HomeAggregatorOutput), nil
}
