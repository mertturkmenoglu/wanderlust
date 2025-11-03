package reviews

import (
	"context"
	"net/http"
	"wanderlust/app/places"
	"wanderlust/pkg/activities"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/di"
	"wanderlust/pkg/middlewares"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
)

func Register(grp *huma.Group, app *core.Application) {
	dbSvc := app.Get(di.SVC_DB).(*db.Db)
	cacheSvc := app.Get(di.SVC_CACHE).(*cache.Cache)
	activitiesSvc := app.Get(di.SVC_ACTIVITIES).(*activities.ActivityService)
	placesSvc := places.NewService(app)

	s := Service{
		placesService: placesSvc,
		repo: &Repository{
			db:            dbSvc.Queries,
			pool:          dbSvc.Pool,
			placesService: placesSvc,
		},
		cache:      cacheSvc,
		activities: activitiesSvc,
	}

	grp.UseSimpleModifier(func(op *huma.Operation) {
		op.Tags = []string{"Reviews"}
	})

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/reviews/{id}",
			Summary:       "Get Review by ID",
			Description:   "Get a review by ID",
			DefaultStatus: http.StatusOK,
		},
		func(ctx context.Context, input *GetReviewByIdInput) (*GetReviewByIdOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.get(ctx, input.ID)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/reviews/",
			Summary:       "Create Review",
			Description:   "Create a review",
			DefaultStatus: http.StatusCreated,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *CreateReviewInput) (*CreateReviewOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.create(ctx, input.Body)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodDelete,
			Path:          "/reviews/{id}",
			Summary:       "Delete Review",
			Description:   "Delete a review",
			DefaultStatus: http.StatusNoContent,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *DeleteReviewInput) (*CreateReviewOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			err := s.remove(ctx, input.ID)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return nil, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/reviews/user/{username}",
			Summary:       "Get Reviews by Username",
			Description:   "Get reviews by username",
			DefaultStatus: http.StatusOK,
		},
		func(ctx context.Context, input *GetReviewsByUsernameInput) (*GetReviewsByUsernameOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.getByUsername(ctx, input.Username, input.PaginationQueryParams)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/reviews/place/{id}",
			Summary:       "Get Reviews by Place ID",
			Description:   "Get reviews by Place ID",
			DefaultStatus: http.StatusOK,
		},
		func(ctx context.Context, input *GetReviewsByPlaceIdInput) (*GetReviewsByPlaceIdOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.getByPoiID(ctx, input)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/reviews/place/{id}/ratings",
			Summary:       "Get Place ratings",
			Description:   "Get ratings for a Place",
			DefaultStatus: http.StatusOK,
		},
		func(ctx context.Context, input *GetRatingsByPlaceIdInput) (*GetRatingsByPlaceIdOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.getRatings(ctx, input.ID)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/reviews/place/{id}/assets",
			Summary:       "Get Place Reviews Assets",
			Description:   "Get assets of the Place reviews",
			DefaultStatus: http.StatusOK,
		},
		func(ctx context.Context, input *GetReviewAssetsByPlaceIdInput) (*GetReviewAssetsByPlaceIdOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.getAssets(ctx, input.ID)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/reviews/{id}/asset",
			Summary:       "Upload Asset for a Review",
			Description:   "Upload asset for a review",
			DefaultStatus: http.StatusCreated,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *UploadReviewAssetInput) (*UploadReviewAssetOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.uploadAsset(ctx, input.ID, input.Body)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)
}
