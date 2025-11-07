package places

import (
	"context"
	"net/http"
	"wanderlust/pkg/core"
	"wanderlust/pkg/middlewares"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
)

func Register(grp *huma.Group, app *core.Application) {
	s := NewService(app)

	grp.UseSimpleModifier(func(op *huma.Operation) {
		op.Tags = []string{"Places"}
	})

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/places/{id}",
			Summary:       "Get Place",
			Description:   "Get a place by ID",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.WithAuth(grp.API),
			},
		},
		func(ctx context.Context, input *GetPlaceByIdInput) (*GetPlaceByIdOutput, error) {
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
			Method:        http.MethodGet,
			Path:          "/places/peek",
			Summary:       "Peek Places",
			Description:   "Get 25 places",
			DefaultStatus: http.StatusOK,
		},
		func(ctx context.Context, input *struct{}) (*PeekPlacesOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.peek(ctx)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPatch,
			Path:          "/places/{id}/info",
			Summary:       "Update Place General Information",
			Description:   "Update a place general information",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *UpdatePlaceInfoInput) (*UpdatePlaceInfoOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.updateInfo(ctx, input.ID, input.Body)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPatch,
			Path:          "/places/{id}/address",
			Summary:       "Update Place Address",
			Description:   "Update a place address",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *UpdatePlaceAddressInput) (*UpdatePlaceAddressOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.updateAddress(ctx, input.ID, input.Body)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPatch,
			Path:          "/places/{id}/amenities",
			Summary:       "Update Place Amenities",
			Description:   "Update a place amenities",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *UpdatePlaceAmenitiesInput) (*UpdatePlaceAmenitiesOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.updateAmenities(ctx, input.ID, input.Body)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPatch,
			Path:          "/places/{id}/hours",
			Summary:       "Update Place Hours",
			Description:   "Update a place hours",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *UpdatePlaceHoursInput) (*UpdatePlaceHoursOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.updateHours(ctx, input.ID, input.Body)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)
}
