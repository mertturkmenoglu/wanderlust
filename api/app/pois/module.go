package pois

import (
	"context"
	"net/http"
	"wanderlust/pkg/core"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/middlewares"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
)

func Register(grp *huma.Group, app *core.Application) {
	s := NewService(app)

	grp.UseSimpleModifier(func(op *huma.Operation) {
		op.Tags = []string{"Point of Interests"}
	})

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/pois/{id}",
			Summary:       "Get Point of Interest",
			Description:   "Get a point of interest by ID",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.WithAuth(grp.API),
			},
		},
		func(ctx context.Context, input *dto.GetPoiByIdInput) (*dto.GetPoiByIdOutput, error) {
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
			Path:          "/pois/peek",
			Summary:       "Peek Point of Interests",
			Description:   "Get 25 pois",
			DefaultStatus: http.StatusOK,
		},
		func(ctx context.Context, input *struct{}) (*dto.PeekPoisOutput, error) {
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
			Path:          "/pois/{id}/info",
			Summary:       "Update Point of Interest General Information",
			Description:   "Update a point of interest general information",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.UpdatePoiInfoInput) (*dto.UpdatePoiInfoOutput, error) {
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
			Path:          "/pois/{id}/address",
			Summary:       "Update Point of Interest Address",
			Description:   "Update a point of interest address",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.UpdatePoiAddressInput) (*dto.UpdatePoiAddressOutput, error) {
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
			Path:          "/pois/{id}/amenities",
			Summary:       "Update Point of Interest Amenities",
			Description:   "Update a point of interest amenities",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.UpdatePoiAmenitiesInput) (*dto.UpdatePoiAmenitiesOutput, error) {
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
			Path:          "/pois/{id}/hours",
			Summary:       "Update Point of Interest Hours",
			Description:   "Update a point of interest hours",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.UpdatePoiHoursInput) (*dto.UpdatePoiHoursOutput, error) {
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

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/pois/{id}/media",
			Summary:       "Upload Media for a POI",
			Description:   "Upload media for a POI",
			DefaultStatus: http.StatusCreated,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.UploadPoiMediaInput) (*dto.UploadPoiMediaOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.uploadMedia(ctx, input)

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
			Path:          "/pois/{id}/media/{index}",
			Summary:       "Delete POI Media",
			Description:   "Delete a POI Media",
			DefaultStatus: http.StatusNoContent,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.DeletePoiMediaInput) (*struct{}, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			err := s.deleteMedia(ctx, input)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return nil, nil
		},
	)
}
