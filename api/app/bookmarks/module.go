package bookmarks

import (
	"context"
	"net/http"
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
		},
		func(ctx context.Context, input *dto.CreateBookmarkInput) (*dto.CreateBookmarkOutput, error) {
			userId := ctx.Value("userId").(string)
			res, err := s.create(input.Body.PoiId, userId)

			if err != nil {
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
		},
		func(ctx context.Context, input *dto.DeleteBookmarkInput) (*struct{}, error) {
			userId := ctx.Value("userId").(string)
			err := s.remove(userId, input.ID)

			if err != nil {
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
		},
		func(ctx context.Context, input *dto.GetUserBookmarksInput) (*dto.GetUserBookmarksOutput, error) {
			userId := ctx.Value("userId").(string)
			res, err := s.get(userId, input.PaginationQueryParams)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)
}
