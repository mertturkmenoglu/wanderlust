package categories

import (
	"context"
	"net/http"
	"wanderlust/pkg/authz"
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

	s := Service{
		&Repository{
			dbSvc.Queries,
			dbSvc.Pool,
		},
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
			Errors:        []int{404, 500},
		},
		func(ctx context.Context, input *struct{}) (*dto.ListCategoriesOutput, error) {
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
			Path:          "/categories/",
			Summary:       "Create Category",
			Description:   "Create a new category",
			DefaultStatus: http.StatusCreated,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActCategoryCreate),
			},
			Security: core.OpenApiJwtSecurity,
			Errors:   []int{400, 401, 403, 409, 422, 500},
		},
		func(ctx context.Context, input *dto.CreateCategoryInput) (*dto.CreateCategoryOutput, error) {
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
			Path:          "/categories/{id}",
			Summary:       "Update Category",
			Description:   "Update a category by id",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActCategoryUpdate),
			},
			Security: core.OpenApiJwtSecurity,
			Errors:   []int{400, 401, 403, 404, 422, 500},
		},
		func(ctx context.Context, input *dto.UpdateCategoryInput) (*dto.UpdateCategoryOutput, error) {
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
			Path:          "/categories/{id}",
			Summary:       "Delete Category",
			Description:   "Delete a category by id",
			DefaultStatus: http.StatusNoContent,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActCategoryDelete),
			},
			Security: core.OpenApiJwtSecurity,
			Errors:   []int{400, 401, 403, 404, 422, 500},
		},
		func(ctx context.Context, input *dto.DeleteCategoryInput) (*struct{}, error) {
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
