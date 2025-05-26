package amenities

import (
	"context"
	"net/http"
	"wanderlust/pkg/authz"
	"wanderlust/pkg/core"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/middlewares"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
)

func Register(grp *huma.Group, app *core.Application) {
	s := Service{
		app,
		app.Db.Queries,
		app.Db.Pool,
	}

	grp.UseSimpleModifier(func(op *huma.Operation) {
		op.Tags = []string{"Amenities"}
	})

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/amenities/",
			Summary:       "List Amenities",
			Description:   "Get all amenities",
			DefaultStatus: http.StatusOK,
		},
		func(ctx context.Context, input *struct{}) (*dto.ListAmenitiesOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.list(ctx)

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
			Path:          "/amenities/",
			Summary:       "Create Amenity",
			Description:   "Create a new amenity",
			DefaultStatus: http.StatusCreated,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActAmenityCreate),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.CreateAmenityInput) (*dto.CreateAmenityOutput, error) {
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
			Method:        http.MethodPatch,
			Path:          "/amenities/{id}",
			Summary:       "Update Amenity",
			Description:   "Update an amenity by id",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActAmenityUpdate),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.UpdateAmenityInput) (*dto.UpdateAmenityOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.update(ctx, input.ID, input.Body)

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
			Path:          "/amenities/{id}",
			Summary:       "Delete Amenity",
			Description:   "Delete an amenity by id",
			DefaultStatus: http.StatusNoContent,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActAmenityDelete),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.DeleteAmenityInput) (*struct{}, error) {
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

}
