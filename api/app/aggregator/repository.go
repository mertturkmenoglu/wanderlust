package aggregator

import (
	"context"
	"wanderlust/app/pois"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/tracing"

	"github.com/cockroachdb/errors"
	"golang.org/x/sync/errgroup"
)

type Repository struct {
	db         *db.Queries
	poiService *pois.Service
}

func (r *Repository) listFavoritePoisIDs(ctx context.Context) ([]string, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	arr, err := r.db.GetFavoritePoisIds(ctx)

	if err != nil {
		return nil, errors.Wrap(ErrListFavorites, err.Error())
	}

	if arr == nil {
		return []string{}, nil
	}

	return arr, nil
}

func (r *Repository) listFeaturedPoisIDs(ctx context.Context) ([]string, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	arr, err := r.db.GetFeaturedPoisIds(ctx)

	if err != nil {
		return nil, errors.Wrap(ErrListFeatured, err.Error())
	}

	if arr == nil {
		return []string{}, nil
	}

	return arr, nil
}

func (r *Repository) listPopularPoisIDs(ctx context.Context) ([]string, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	arr, err := r.db.GetPopularPoisIds(ctx)

	if err != nil {
		return nil, errors.Wrap(ErrListPopular, err.Error())
	}

	if arr == nil {
		return []string{}, nil
	}

	return arr, nil
}

func (r *Repository) listNewPoisIDs(ctx context.Context) ([]string, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	arr, err := r.db.GetNewPoisIds(ctx)

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
		dbNew, err = r.listNewPoisIDs(gctx)
		return err
	})

	g.Go(func() error {
		var err error
		dbPopular, err = r.listPopularPoisIDs(gctx)
		return err
	})

	g.Go(func() error {
		var err error
		dbFeatured, err = r.listFeaturedPoisIDs(gctx)
		return err
	})

	g.Go(func() error {
		var err error
		dbFavorites, err = r.listFavoritePoisIDs(gctx)
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

	allPois, err := r.poiService.FindMany(ctx, allIds)

	if err != nil {
		return nil, errors.Wrap(ErrAggregation, err.Error())
	}

	poisNew := make([]dto.Place, 0, len(dbNew))
	poisPopular := make([]dto.Place, 0, len(dbPopular))
	poisFeatured := make([]dto.Place, 0, len(dbFeatured))
	poisFavorites := make([]dto.Place, 0, len(dbFavorites))

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

	obj := &HomeAggregatorOutput{
		Body: HomeAggregatorOutputBody{
			New:       poisNew,
			Popular:   poisPopular,
			Featured:  poisFeatured,
			Favorites: poisFavorites,
		},
	}

	return obj, nil
}
