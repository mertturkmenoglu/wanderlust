package amenities

import (
	"context"
	"net/http"
	"wanderlust/internal/pkg/authz"
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
			err := s.remove(input.ID)

			if err != nil {
				return nil, err
			}

			return nil, nil
		},
	)

}
