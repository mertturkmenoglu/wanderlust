package bookmarks

import (
	"context"
	"fmt"
	"net/http"
	"wanderlust/app/pois"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/di"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/middlewares"
	"wanderlust/pkg/tracing"

	"github.com/cockroachdb/errors"
	"github.com/danielgtaylor/huma/v2"
)

func Register(grp *huma.Group, app *core.Application) {
	dbSvc := app.Get(di.SVC_DB).(*db.Db)

	s := Service{
		pois.NewService(app),
		&Repository{
			dbSvc.Queries,
			dbSvc.Pool,
		},
	}

	grp.UseSimpleModifier(func(op *huma.Operation) {
		op.Tags = []string{"Bookmarks"}
	})

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/bookmarks/",
			Summary:       "Create Bookmark",
			Description:   "Create a bookmark for a point of interest",
			DefaultStatus: http.StatusCreated,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
			Errors:   []int{400, 401, 409, 422, 500},
		},
		func(ctx context.Context, input *dto.CreateBookmarkInput) (*dto.CreateBookmarkOutput, error) {
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
			Path:          "/bookmarks/{id}",
			Summary:       "Delete Bookmark",
			Description:   "Delete a bookmark for a point of interest",
			DefaultStatus: http.StatusNoContent,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
			Errors:   []int{400, 401, 404, 422, 500},
		},
		func(ctx context.Context, input *dto.DeleteBookmarkInput) (*struct{}, error) {
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
			Method:        http.MethodGet,
			Path:          "/bookmarks/",
			Summary:       "Get User Bookmarks",
			Description:   "Get a list of bookmarks for the current user",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
			Errors:   []int{400, 401, 404, 422, 500},
		},
		func(ctx context.Context, input *dto.GetUserBookmarksInput) (*dto.GetUserBookmarksOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.list(ctx, input.PaginationQueryParams)

			if err != nil {
				sp.RecordError(errors.New(fmt.Sprintf("%+v", err)))
				return nil, err
			}

			return res, nil
		},
	)
}
