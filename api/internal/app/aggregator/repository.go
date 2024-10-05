package aggregator

import (
	"context"
	"sync"
	"wanderlust/internal/db"
)

func (r *repository) getHomeAggregation() (GetHomeAggregationDao, error) {
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
		dbNew, errNew = r.getNewPois()
	}()

	go func() {
		defer wg.Done()
		dbPopular, errPopular = r.getPopularPois()
	}()

	go func() {
		defer wg.Done()
		dbFeatured, errFeatured = r.getFeaturedPois()
	}()

	go func() {
		defer wg.Done()
		dbFavorites, errFavorites = r.getFavoritePois()
	}()

	// Wait for all queries to finish
	wg.Wait()

	if errNew != nil || errPopular != nil || errFeatured != nil || errFavorites != nil {
		return GetHomeAggregationDao{}, errNew
	}

	return GetHomeAggregationDao{
		new:       dbNew,
		popular:   dbPopular,
		featured:  dbFeatured,
		favorites: dbFavorites,
	}, nil
}

func (r *repository) getNewPois() ([]db.GetNewPoisRow, error) {
	arr, err := r.db.Queries.GetNewPois(context.Background())

	if err != nil {
		return nil, err
	}

	if arr == nil {
		return []db.GetNewPoisRow{}, nil
	}

	return arr, nil
}

func (r *repository) getPopularPois() ([]db.GetPopularPoisRow, error) {
	arr, err := r.db.Queries.GetPopularPois(context.Background())

	if err != nil {
		return nil, err
	}

	if arr == nil {
		return []db.GetPopularPoisRow{}, nil
	}

	return arr, nil
}

func (r *repository) getFeaturedPois() ([]db.GetFeaturedPoisRow, error) {
	arr, err := r.db.Queries.GetFeaturedPois(context.Background())

	if err != nil {
		return nil, err
	}

	if arr == nil {
		return []db.GetFeaturedPoisRow{}, nil
	}

	return arr, nil
}

func (r *repository) getFavoritePois() ([]db.GetFavoritePoisRow, error) {
	arr, err := r.db.Queries.GetFavoritePois(context.Background())

	if err != nil {
		return nil, err
	}

	if arr == nil {
		return []db.GetFavoritePoisRow{}, nil
	}

	return arr, nil
}
