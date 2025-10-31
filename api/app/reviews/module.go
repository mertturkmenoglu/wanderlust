package reviews

import (
	"context"
	"net/http"
	"wanderlust/app/pois"
	"wanderlust/pkg/activities"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/di"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/middlewares"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
)

func Register(grp *huma.Group, app *core.Application) {
	dbSvc := app.Get(di.SVC_DB).(*db.Db)
	cacheSvc := app.Get(di.SVC_CACHE).(*cache.Cache)
	activitiesSvc := app.Get(di.SVC_ACTIVITIES).(*activities.ActivityService)

	s := Service{
		poiService: pois.NewService(app),
		db:         dbSvc.Queries,
		pool:       dbSvc.Pool,
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
		func(ctx context.Context, input *dto.GetReviewByIdInput) (*dto.GetReviewByIdOutput, error) {
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
		func(ctx context.Context, input *dto.CreateReviewInput) (*dto.CreateReviewOutput, error) {
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
		func(ctx context.Context, input *dto.DeleteReviewInput) (*dto.CreateReviewOutput, error) {
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
		func(ctx context.Context, input *dto.GetReviewsByUsernameInput) (*dto.GetReviewsByUsernameOutput, error) {
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
			Path:          "/reviews/poi/{id}",
			Summary:       "Get Reviews by POI ID",
			Description:   "Get reviews by POI ID",
			DefaultStatus: http.StatusOK,
		},
		func(ctx context.Context, input *dto.GetReviewsByPoiIdInput) (*dto.GetReviewsByPoiIdOutput, error) {
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
			Path:          "/reviews/poi/{id}/ratings",
			Summary:       "Get POI ratings",
			Description:   "Get ratings for a POI",
			DefaultStatus: http.StatusOK,
		},
		func(ctx context.Context, input *dto.GetRatingsByPoiIdInput) (*dto.GetRatingsByPoiIdOutput, error) {
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
			Path:          "/reviews/poi/{id}/images",
			Summary:       "Get POI Reviews Images",
			Description:   "Get images of the POI reviews",
			DefaultStatus: http.StatusOK,
		},
		func(ctx context.Context, input *dto.GetReviewImagesByPoiIdInput) (*dto.GetReviewImagesByPoiIdOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.getImages(ctx, input.ID)

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
			Path:          "/reviews/{id}/media",
			Summary:       "Upload Media for a Review",
			Description:   "Upload media for a review",
			DefaultStatus: http.StatusCreated,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.UploadReviewMediaInput) (*dto.UploadReviewMediaOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.uploadMedia(ctx, input.ID, input.Body)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)
}
