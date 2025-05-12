package aggregator

import (
	"context"
	"sync"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mapper"
)

type Service struct {
	app *core.Application
}

func (s *Service) checkCacheForHomeAggregation() (*dto.HomeAggregatorOutput, error) {
	var cacheRes dto.HomeAggregatorOutput

	err := s.app.Cache.ReadObj(cache.KeyHomeAggregations, &cacheRes)

	if err == nil {
		return &cacheRes, nil
	}

	return nil, err
}

func (s *Service) getHomeAggregation() (*dto.HomeAggregatorOutput, error) {
	cacheRes, err := s.checkCacheForHomeAggregation()

	if err == nil {
		return cacheRes, nil
	}

	dao, err := s.getHomeAggregationFromDb()

	if err != nil {
		return nil, err
	}

	dto := mapper.ToHomeAggregatorOutput(
		dao.new,
		dao.popular,
		dao.featured,
		dao.favorites,
	)

	err = s.app.Cache.SetObj(cache.KeyHomeAggregations, dto, cache.TTLHomeAggregations)

	if err != nil {
		return nil, err
	}

	return &dto, nil
}

func (s *Service) getHomeAggregationFromDb() (*GetHomeAggregationDao, error) {
	var (
		wg           sync.WaitGroup
		dbNew        []db.GetNewPoisRow
		dbPopular    []db.GetPopularPoisRow
		dbFeatured   []db.GetFeaturedPoisRow
		dbFavorites  []db.GetFavoritePoisRow
		errNew       error
		errPopular   error
		errFeatured  error
		errFavorites error
	)

	wg.Add(4)

	go func() {
		defer wg.Done()
		dbNew, errNew = s.getNewPois()
	}()

	go func() {
		defer wg.Done()
		dbPopular, errPopular = s.getPopularPois()
	}()

	go func() {
		defer wg.Done()
		dbFeatured, errFeatured = s.getFeaturedPois()
	}()

	go func() {
		defer wg.Done()
		dbFavorites, errFavorites = s.getFavoritePois()
	}()

	// Wait for all queries to finish
	wg.Wait()

	if errNew != nil || errPopular != nil || errFeatured != nil || errFavorites != nil {
		return nil, errNew
	}

	return &GetHomeAggregationDao{
		new:       dbNew,
		popular:   dbPopular,
		featured:  dbFeatured,
		favorites: dbFavorites,
	}, nil
}

func (s *Service) getNewPois() ([]db.GetNewPoisRow, error) {
	arr, err := s.app.Db.Queries.GetNewPois(context.Background())

	if err != nil {
		return nil, err
	}

	if arr == nil {
		return []db.GetNewPoisRow{}, nil
	}

	return arr, nil
}

func (s *Service) getPopularPois() ([]db.GetPopularPoisRow, error) {
	arr, err := s.app.Db.Queries.GetPopularPois(context.Background())

	if err != nil {
		return nil, err
	}

	if arr == nil {
		return []db.GetPopularPoisRow{}, nil
	}

	return arr, nil
}

func (s *Service) getFeaturedPois() ([]db.GetFeaturedPoisRow, error) {
	arr, err := s.app.Db.Queries.GetFeaturedPois(context.Background())

	if err != nil {
		return nil, err
	}

	if arr == nil {
		return []db.GetFeaturedPoisRow{}, nil
	}

	return arr, nil
}

func (s *Service) getFavoritePois() ([]db.GetFavoritePoisRow, error) {
	arr, err := s.app.Db.Queries.GetFavoritePois(context.Background())

	if err != nil {
		return nil, err
	}

	if arr == nil {
		return []db.GetFavoritePoisRow{}, nil
	}

	return arr, nil
}
