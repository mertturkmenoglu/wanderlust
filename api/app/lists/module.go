package lists

import (
	"context"
	"net/http"
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
		db:   dbSvc.Queries,
		pool: dbSvc.Pool,
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
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.getAllLists(ctx, input.PaginationQueryParams)

			if err != nil {
				sp.RecordError(err)
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
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.GetListByIdInput) (*dto.GetListByIdOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.getList(ctx, input.ID)

			if err != nil {
				sp.RecordError(err)
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
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.GetListStatusesInput) (*dto.GetListStatusesOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.getListStatus(ctx, input.PoiID)

			if err != nil {
				sp.RecordError(err)
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
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.getPublicLists(ctx, input.Username, input.PaginationQueryParams)

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
			Path:          "/lists/{id}",
			Summary:       "Update List",
			Description:   "Update a list by id",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.UpdateListInput) (*dto.UpdateListOutput, error) {
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
			Path:          "/lists/{id}",
			Summary:       "Delete List",
			Description:   "Delete a list by id",
			DefaultStatus: http.StatusNoContent,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.DeleteListInput) (*struct{}, error) {
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

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/lists/{id}/items",
			Summary:       "Create List Item",
			Description:   "Add an item to a list by its id",
			DefaultStatus: http.StatusCreated,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.CreateListItemInput) (*dto.CreateListItemOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.createListItem(ctx, input.ID, input.Body)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, err
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
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.UpdateListItemsInput) (*dto.UpdateListItemsOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.updateListItems(ctx, input.ID, input.Body.PoiIds)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)
}
