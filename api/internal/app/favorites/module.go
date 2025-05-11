package favorites

import (
	"context"
	"net/http"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/dto"
	"wanderlust/internal/pkg/middlewares"

	"github.com/danielgtaylor/huma/v2"
)

func Register(grp *huma.Group, app *core.Application) {
	s := Service{
		app: app,
	}

	grp.UseSimpleModifier(func(op *huma.Operation) {
		op.Tags = []string{"Favorites"}
	})

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/favorites/",
			Summary:       "Create Favorite",
			Description:   "Create a favorite for a point of interest",
			DefaultStatus: http.StatusCreated,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.CreateFavoriteInput) (*dto.CreateFavoriteOutput, error) {
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
			Path:          "/favorites/{id}",
			Summary:       "Delete Favorite",
			Description:   "Delete a favorite for a point of interest",
			DefaultStatus: http.StatusNoContent,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.DeleteFavoriteInput) (*struct{}, error) {
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
			Path:          "/favorites/",
			Summary:       "Get User Favorites",
			Description:   "Get a list of favorites for the current user",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.GetUserFavoritesInput) (*dto.GetUserFavoritesOutput, error) {
			userId := ctx.Value("userId").(string)
			res, err := s.get(userId, input.PaginationQueryParams)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/favorites/{username}",
			Summary:       "Get User Favorites by Username",
			Description:   "Get a list of favorites for the given username",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.GetUserFavoritesByUsernameInput) (*dto.GetUserFavoritesOutput, error) {
			res, err := s.getByUsername(input.Username, input.PaginationQueryParams)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)
}
