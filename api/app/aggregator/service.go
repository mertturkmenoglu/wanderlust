package aggregator

import (
	"context"
	"slices"
	"sync"
	"wanderlust/app/pois"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/core"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
	"golang.org/x/sync/errgroup"
	"golang.org/x/sync/singleflight"
)

type Service struct {
	app          *core.Application
	poisService  *pois.Service
	cacheMutex   sync.RWMutex
	requestGroup singleflight.Group
}

func (s *Service) checkCacheForHomeAggregation(ctx context.Context) (*dto.HomeAggregatorOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.app.Cache.Read(ctx, cache.KeyHomeAggregations)

	if err == nil {
		return res.(*dto.HomeAggregatorOutput), nil
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
		obj, err := s.getHomeAggregationFromDb(ctx)

		if err != nil {
			sp.RecordError(err)
			return nil, err
		}

		s.cacheMutex.Lock()
		defer s.cacheMutex.Unlock()

		err = s.app.Cache.Write(ctx, cache.KeyHomeAggregations, obj, cache.TTLHomeAggregations)

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

func (s *Service) getHomeAggregationFromDb(ctx context.Context) (*dto.HomeAggregatorOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	var (
		dbNew       []string
		dbPopular   []string
		dbFeatured  []string
		dbFavorites []string
	)

	g, gctx := errgroup.WithContext(ctx)

	g.Go(func() error {
		var err error
		dbNew, err = s.getNewPoisIds(gctx)
		return err
	})

	g.Go(func() error {
		var err error
		dbPopular, err = s.getPopularPoisIds(gctx)
		return err
	})

	g.Go(func() error {
		var err error
		dbFeatured, err = s.getFeaturedPoisIds(gctx)
		return err
	})

	g.Go(func() error {
		var err error
		dbFavorites, err = s.getFavoritePoisIds(gctx)
		return err
	})

	if err := g.Wait(); err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get points of interests")
	}

	totalCapacity := len(dbNew) + len(dbPopular) + len(dbFeatured) + len(dbFavorites)

	allIds := make([]string, 0, totalCapacity)
	allIds = append(allIds, dbNew...)
	allIds = append(allIds, dbPopular...)
	allIds = append(allIds, dbFeatured...)
	allIds = append(allIds, dbFavorites...)

	allPois, err := s.poisService.FindMany(ctx, allIds)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	poisNew := make([]dto.Poi, 0, len(dbNew))
	poisPopular := make([]dto.Poi, 0, len(dbPopular))
	poisFeatured := make([]dto.Poi, 0, len(dbFeatured))
	poisFavorites := make([]dto.Poi, 0, len(dbFavorites))

	for _, v := range allPois {
		if contains(dbNew, v.ID) {
			poisNew = append(poisNew, v)
		}

		if contains(dbPopular, v.ID) {
			poisPopular = append(poisPopular, v)
		}

		if contains(dbFeatured, v.ID) {
			poisFeatured = append(poisFeatured, v)
		}

		if contains(dbFavorites, v.ID) {
			poisFavorites = append(poisFavorites, v)
		}
	}

	return &dto.HomeAggregatorOutput{
		Body: dto.HomeAggregatorOutputBody{
			New:       poisNew,
			Popular:   poisPopular,
			Featured:  poisFeatured,
			Favorites: poisFavorites,
		},
	}, nil
}

func contains(s []string, e string) bool {
	return slices.ContainsFunc(s, func(x string) bool {
		return x == e
	})
}

func (s *Service) getNewPoisIds(ctx context.Context) ([]string, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	arr, err := s.app.Db.Queries.GetNewPoisIds(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	if arr == nil {
		return []string{}, nil
	}

	return arr, nil
}

func (s *Service) getPopularPoisIds(ctx context.Context) ([]string, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	arr, err := s.app.Db.Queries.GetPopularPoisIds(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	if arr == nil {
		return []string{}, nil
	}

	return arr, nil
}

func (s *Service) getFeaturedPoisIds(ctx context.Context) ([]string, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	arr, err := s.app.Db.Queries.GetFeaturedPoisIds(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	if arr == nil {
		return []string{}, nil
	}

	return arr, nil
}

func (s *Service) getFavoritePoisIds(ctx context.Context) ([]string, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	arr, err := s.app.Db.Queries.GetFavoritePoisIds(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	if arr == nil {
		return []string{}, nil
	}

	return arr, nil
}
