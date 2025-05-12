package categories

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
		op.Tags = []string{"Categories"}
	})

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/categories/",
			Summary:       "List Categories",
			Description:   "Get all categories",
			DefaultStatus: http.StatusOK,
		},
		func(ctx context.Context, input *struct{}) (*dto.ListCategoriesOutput, error) {
			res, err := s.list()

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/categories/",
			Summary:       "Create Category",
			Description:   "Create a new category",
			DefaultStatus: http.StatusCreated,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActCategoryCreate),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.CreateCategoryInput) (*dto.CreateCategoryOutput, error) {
			res, err := s.create(input.Body)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPatch,
			Path:          "/categories/{id}",
			Summary:       "Update Category",
			Description:   "Update a category by id",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActCategoryUpdate),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.UpdateCategoryInput) (*dto.UpdateCategoryOutput, error) {
			res, err := s.update(input.ID, input.Body)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodDelete,
			Path:          "/categories/{id}",
			Summary:       "Delete Category",
			Description:   "Delete a category by id",
			DefaultStatus: http.StatusNoContent,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActCategoryDelete),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.DeleteCategoryInput) (*struct{}, error) {
			err := s.remove(input.ID)

			if err != nil {
				return nil, err
			}

			return nil, nil
		},
	)
}
