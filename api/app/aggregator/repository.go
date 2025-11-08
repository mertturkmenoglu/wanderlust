package aggregator

import (
	"context"
	"wanderlust/app/places"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/tracing"

	"github.com/cockroachdb/errors"
	"golang.org/x/sync/errgroup"
)

type Repository struct {
	db            *db.Queries
	placesService *places.Service
}

func (r *Repository) listFavoritePlaceIDs(ctx context.Context) ([]string, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	arr, err := r.db.FindManyFavoritePlaceIds(ctx)

	if err != nil {
		return nil, errors.Wrap(ErrListFavorites, err.Error())
	}

	if arr == nil {
		return []string{}, nil
	}

	return arr, nil
}

func (r *Repository) listFeaturedPlaceIDs(ctx context.Context) ([]string, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	arr, err := r.db.FindManyFeaturedPlaceIds(ctx)

	if err != nil {
		return nil, errors.Wrap(ErrListFeatured, err.Error())
	}

	if arr == nil {
		return []string{}, nil
	}

	return arr, nil
}

func (r *Repository) listPopularPlaceIDs(ctx context.Context) ([]string, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	arr, err := r.db.FindManyPopularPlaceIds(ctx)

	if err != nil {
		return nil, errors.Wrap(ErrListPopular, err.Error())
	}

	if arr == nil {
		return []string{}, nil
	}

	return arr, nil
}

func (r *Repository) listNewPlaceIDs(ctx context.Context) ([]string, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	arr, err := r.db.FindManyNewPlaceIds(ctx)

	if err != nil {
		return nil, errors.Wrap(ErrListNew, err.Error())
	}

	if arr == nil {
		return []string{}, nil
	}

	return arr, nil
}

func (r *Repository) getHomeAggregation(ctx context.Context) (*HomeAggregatorOutput, error) {
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
		dbNew, err = r.listNewPlaceIDs(gctx)
		return err
	})

	g.Go(func() error {
		var err error
		dbPopular, err = r.listPopularPlaceIDs(gctx)
		return err
	})

	g.Go(func() error {
		var err error
		dbFeatured, err = r.listFeaturedPlaceIDs(gctx)
		return err
	})

	g.Go(func() error {
		var err error
		dbFavorites, err = r.listFavoritePlaceIDs(gctx)
		return err
	})

	if err := g.Wait(); err != nil {
		return nil, errors.Wrap(ErrAggregation, err.Error())
	}

	totalCapacity := len(dbNew) + len(dbPopular) + len(dbFeatured) + len(dbFavorites)

	allIds := make([]string, 0, totalCapacity)

	allIds = append(allIds, dbNew...)
	allIds = append(allIds, dbPopular...)
	allIds = append(allIds, dbFeatured...)
	allIds = append(allIds, dbFavorites...)

	allPlaces, err := r.placesService.FindMany(ctx, allIds)

	if err != nil {
		return nil, errors.Wrap(ErrAggregation, err.Error())
	}

	newPlaces := make([]dto.Place, 0, len(dbNew))
	popularPlaces := make([]dto.Place, 0, len(dbPopular))
	featuredPlaces := make([]dto.Place, 0, len(dbFeatured))
	favoritePlaces := make([]dto.Place, 0, len(dbFavorites))

	for _, v := range allPlaces {
		if contains(dbNew, v.ID) {
			newPlaces = append(newPlaces, v)
		}

		if contains(dbPopular, v.ID) {
			popularPlaces = append(popularPlaces, v)
		}

		if contains(dbFeatured, v.ID) {
			featuredPlaces = append(featuredPlaces, v)
		}

		if contains(dbFavorites, v.ID) {
			favoritePlaces = append(favoritePlaces, v)
		}
	}

	obj := &HomeAggregatorOutput{
		Body: HomeAggregatorOutputBody{
			New:       newPlaces,
			Popular:   popularPlaces,
			Featured:  featuredPlaces,
			Favorites: favoritePlaces,
		},
	}

	return obj, nil
}
