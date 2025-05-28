package aggregator

import (
	"context"
	"slices"
	"sync"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/core"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mapper"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
)

type Service struct {
	app *core.Application
}

func (s *Service) checkCacheForHomeAggregation(ctx context.Context) (*dto.HomeAggregatorOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	var cacheRes dto.HomeAggregatorOutput

	err := s.app.Cache.ReadObj(ctx, cache.KeyHomeAggregations, &cacheRes)

	if err == nil {
		return &cacheRes, nil
	}

	return nil, err
}

func (s *Service) getHomeAggregation(ctx context.Context) (*dto.HomeAggregatorOutput, error) {
	spanCtx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	cacheRes, err := s.checkCacheForHomeAggregation(spanCtx)

	if err == nil {
		return cacheRes, nil
	}

	obj, err := s.getHomeAggregationFromDb(spanCtx)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	err = s.app.Cache.SetObj(ctx, cache.KeyHomeAggregations, obj, cache.TTLHomeAggregations)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	return obj, nil
}

func (s *Service) getHomeAggregationFromDb(ctx context.Context) (*dto.HomeAggregatorOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	var (
		wg           sync.WaitGroup
		dbNew        []string
		dbPopular    []string
		dbFeatured   []string
		dbFavorites  []string
		errNew       error
		errPopular   error
		errFeatured  error
		errFavorites error
	)

	wg.Add(4)

	go func() {
		defer wg.Done()
		dbNew, errNew = s.getNewPoisIds(ctx)
	}()

	go func() {
		defer wg.Done()
		dbPopular, errPopular = s.getPopularPoisIds(ctx)
	}()

	go func() {
		defer wg.Done()
		dbFeatured, errFeatured = s.getFeaturedPoisIds(ctx)
	}()

	go func() {
		defer wg.Done()
		dbFavorites, errFavorites = s.getFavoritePoisIds(ctx)
	}()

	// Wait for all queries to finish
	wg.Wait()

	if errNew != nil {
		sp.RecordError(errNew)
		return nil, errNew
	}

	if errPopular != nil {
		sp.RecordError(errPopular)
		return nil, errPopular
	}

	if errFeatured != nil {
		sp.RecordError(errFeatured)
		return nil, errFeatured
	}

	if errFavorites != nil {
		sp.RecordError(errFavorites)
		return nil, errFavorites
	}

	totalCapacity := len(dbNew) + len(dbPopular) + len(dbFeatured) + len(dbFavorites)

	allIds := make([]string, 0, totalCapacity)
	allIds = append(allIds, dbNew...)
	allIds = append(allIds, dbPopular...)
	allIds = append(allIds, dbFeatured...)
	allIds = append(allIds, dbFavorites...)

	allPois, err := s.getPoisByIds(ctx, allIds)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	poisNew := make([]dto.Poi, 0, len(dbNew))
	poisPopular := make([]dto.Poi, 0, len(dbPopular))
	poisFeatured := make([]dto.Poi, 0, len(dbFeatured))
	poisFavorites := make([]dto.Poi, 0, len(dbFavorites))

	for _, v := range allPois {
		if slices.ContainsFunc(dbNew, func(x string) bool {
			return x == v.ID
		}) {
			poisNew = append(poisNew, v)
		}

		if slices.ContainsFunc(dbPopular, func(x string) bool {
			return x == v.ID
		}) {
			poisPopular = append(poisPopular, v)
		}

		if slices.ContainsFunc(dbFeatured, func(x string) bool {
			return x == v.ID
		}) {
			poisFeatured = append(poisFeatured, v)
		}

		if slices.ContainsFunc(dbFavorites, func(x string) bool {
			return x == v.ID
		}) {
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

func (s *Service) getPoisByIds(ctx context.Context, ids []string) ([]dto.Poi, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbPois, err := s.app.Db.Queries.GetPoisByIdsPopulated(ctx, ids)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("failed to get point of interests")
	}

	pois, err := mapper.FromDbPoisToPois(ctx, dbPois)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	return pois, nil
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
