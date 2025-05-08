package reviews

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
		op.Tags = []string{"Reviews"}
	})

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/reviews/{id}",
			Summary:       "Get Review by ID",
			Description:   "Get a review by ID",
			DefaultStatus: http.StatusOK,
		},
		func(ctx context.Context, input *dto.GetReviewByIdInput) (*dto.GetReviewByIdOutput, error) {
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
			Path:          "/reviews/",
			Summary:       "Create Review",
			Description:   "Create a review",
			DefaultStatus: http.StatusCreated,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.CreateReviewInput) (*dto.CreateReviewOutput, error) {
			userId := ctx.Value("userId").(string)
			res, err := s.create(userId, input.Body)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodDelete,
			Path:          "/reviews/{id}",
			Summary:       "Delete Review",
			Description:   "Delete a review",
			DefaultStatus: http.StatusNoContent,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.DeleteReviewInput) (*dto.CreateReviewOutput, error) {
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
			Path:          "/reviews/user/{username}",
			Summary:       "Get Reviews by Username",
			Description:   "Get reviews by username",
			DefaultStatus: http.StatusOK,
		},
		func(ctx context.Context, input *dto.GetReviewsByUsernameInput) (*dto.GetReviewsByUsernameOutput, error) {
			res, err := s.getByUsername(input.Username, input.PaginationQueryParams)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/reviews/poi/{id}",
			Summary:       "Get Reviews by POI ID",
			Description:   "Get reviews by POI ID",
			DefaultStatus: http.StatusOK,
		},
		func(ctx context.Context, input *dto.GetReviewsByPoiIdInput) (*dto.GetReviewsByPoiIdOutput, error) {
			res, err := s.getByPoiID(input.ID, input.PaginationQueryParams)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/reviews/poi/{id}/ratings",
			Summary:       "Get POI ratings",
			Description:   "Get ratings for a POI",
			DefaultStatus: http.StatusOK,
		},
		func(ctx context.Context, input *dto.GetRatingsByPoiIdInput) (*dto.GetRatingsByPoiIdOutput, error) {
			res, err := s.getRatings(input.ID)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)
}
