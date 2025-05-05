package lists

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
		op.Tags = []string{"Lists"}
	})

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/lists/",
			Summary:       "Get All Lists of User",
			Description:   "Get all lists of the current user",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.GetAllListsOfUserInput) (*dto.GetAllListsOfUserOutput, error) {
			userId := ctx.Value("userId").(string)
			res, err := s.getAllLists(userId, input.PaginationQueryParams)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/lists/{id}",
			Summary:       "Get List by ID",
			Description:   "Get a list by id",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.WithAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActListRead),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.GetListByIdInput) (*dto.GetListByIdOutput, error) {
			res, err := s.getList(input.ID)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/lists/status/{poiId}",
			Summary:       "Check if List Includes POI",
			Description:   "Check if list includes given poi id",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActListStatusRead),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.GetListStatusesInput) (*dto.GetListStatusesOutput, error) {
			userId := ctx.Value("userId").(string)
			res, err := s.getListStatus(userId, input.PoiID)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/lists/user/{username}",
			Summary:       "Get Public Lists of User",
			Description:   "Get public lists of user with username",
			DefaultStatus: http.StatusOK,
		},
		func(ctx context.Context, input *dto.GetPublicListsOfUserInput) (*dto.GetPublicListsOfUserOutput, error) {
			res, err := s.getPublicLists(input.Username, input.PaginationQueryParams)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/lists/",
			Summary:       "Create List",
			Description:   "Create a new list",
			DefaultStatus: http.StatusCreated,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.CreateListInput) (*dto.CreateListOutput, error) {
			userId := ctx.Value("userId").(string)
			res, err := s.createList(userId, input.Body)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPatch,
			Path:          "/lists/{id}",
			Summary:       "Update List",
			Description:   "Update a list by id",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActListUpdate),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.UpdateListInput) (*dto.UpdateListOutput, error) {
			res, err := s.updateList(input.ID, input.Body)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodDelete,
			Path:          "/lists/{id}",
			Summary:       "Delete List",
			Description:   "Delete a list by id",
			DefaultStatus: http.StatusNoContent,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActListDelete),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.DeleteListInput) (*struct{}, error) {
			err := s.deleteList(input.ID)

			if err != nil {
				return nil, err
			}

			return nil, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/lists/{id}/items",
			Summary:       "Create List Item",
			Description:   "Add an item to a list by its id",
			DefaultStatus: http.StatusCreated,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActListItemCreate),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.CreateListItemInput) (*dto.CreateListItemOutput, error) {
			res, err := s.createListItem(input.ID, input.Body)

			if err != nil {
				return nil, err
			}

			return res, err
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodDelete,
			Path:          "/lists/{id}/items/{poiId}",
			Summary:       "Remove List Item",
			Description:   "Remove a POI from a list",
			DefaultStatus: http.StatusNoContent,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActListItemDelete),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, i *struct{}) (*struct{}, error) {
			return nil, huma.Error501NotImplemented("Not implemented")
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPatch,
			Path:          "/lists/{id}/items",
			Summary:       "Update List Items",
			Description:   "Update the items of a list",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActListItemUpdate),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, i *struct{}) (*struct{}, error) {
			return nil, huma.Error501NotImplemented("Not implemented")
		},
	)
}
