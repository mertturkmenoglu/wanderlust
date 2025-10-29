package cities

import (
	"context"
	"fmt"
	"net/http"
	"wanderlust/pkg/authz"
	"wanderlust/pkg/core"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/middlewares"
	"wanderlust/pkg/tracing"

	"github.com/cockroachdb/errors"
	"github.com/danielgtaylor/huma/v2"
)

func Register(grp *huma.Group, app *core.Application) {
	s := Service{
		&Repository{
			app.Db.Queries,
			app.Db.Pool,
		},
	}

	grp.UseSimpleModifier(func(op *huma.Operation) {
		op.Tags = []string{"Cities"}
	})

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/cities/",
			DefaultStatus: http.StatusOK,
			Summary:       "List cities",
			Description:   "List cities",
		},
		func(ctx context.Context, input *struct{}) (*dto.CitiesListOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.list(ctx)

			if err != nil {
				sp.RecordError(errors.New(fmt.Sprintf("%+v", err)))
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/cities/featured",
			DefaultStatus: http.StatusOK,
			Summary:       "Featured cities",
			Description:   "Get featured cities",
		},
		func(ctx context.Context, input *struct{}) (*dto.CitiesFeaturedOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.featured(ctx)

			if err != nil {
				sp.RecordError(errors.New(fmt.Sprintf("%+v", err)))
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/cities/{id}",
			DefaultStatus: http.StatusOK,
			Summary:       "Get city",
			Description:   "Get city by ID",
		},
		func(ctx context.Context, input *dto.GetCityByIdInput) (*dto.GetCityByIdOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.get(ctx, input.ID)

			if err != nil {
				sp.RecordError(errors.New(fmt.Sprintf("%+v", err)))
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/cities/",
			DefaultStatus: http.StatusCreated,
			Summary:       "Create city",
			Description:   "Create a new city",
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActCityCreate),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.CreateCityInput) (*dto.CreateCityOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.create(ctx, input.Body)

			if err != nil {
				sp.RecordError(errors.New(fmt.Sprintf("%+v", err)))
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodDelete,
			Path:          "/cities/{id}",
			DefaultStatus: http.StatusNoContent,
			Summary:       "Delete city",
			Description:   "Delete city by ID",
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActCityDelete),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.DeleteCityInput) (*struct{}, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			err := s.remove(ctx, input.ID)

			if err != nil {
				sp.RecordError(errors.New(fmt.Sprintf("%+v", err)))
				return nil, err
			}

			return nil, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPatch,
			Path:          "/cities/{id}",
			DefaultStatus: http.StatusOK,
			Summary:       "Update city",
			Description:   "Update city by ID",
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActCityUpdate),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.UpdateCityInput) (*dto.UpdateCityOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.update(ctx, input.ID, input.Body)

			if err != nil {
				sp.RecordError(errors.New(fmt.Sprintf("%+v", err)))
				return nil, err
			}

			return res, nil
		},
	)
}
