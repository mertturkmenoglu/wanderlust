package cities

import (
	"context"
	"net/http"
	"wanderlust/pkg/authz"
	"wanderlust/pkg/core"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/middlewares"

	"github.com/danielgtaylor/huma/v2"
)

func Register(grp *huma.Group, app *core.Application) {
	s := Service{
		app: app,
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
			res, err := s.list()

			if err != nil {
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
			res, err := s.featured()

			if err != nil {
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
			res, err := s.get(input.ID)

			if err != nil {
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
			res, err := s.create(input.Body)

			if err != nil {
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
			err := s.remove(input.ID)

			if err != nil {
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
			res, err := s.update(input.ID, input.Body)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)
}
