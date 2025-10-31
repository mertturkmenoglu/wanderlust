package collections

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
		op.Tags = []string{"Collections"}
	})

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/collections/",
			Summary:       "List Collections",
			Description:   "List all collections",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActCollectionCRUD),
			},
			Security: core.OpenApiJwtSecurity,
			Errors:   []int{400, 401, 403, 404, 422, 500},
		},
		func(ctx context.Context, input *dto.GetCollectionsInput) (*dto.GetCollectionsOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.list(ctx, input.PaginationQueryParams)

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
			Path:          "/collections/{id}",
			Summary:       "Get Collection by ID",
			Description:   "Get a collection by ID",
			DefaultStatus: http.StatusOK,
			Errors:        []int{400, 404, 422, 500},
		},
		func(ctx context.Context, input *dto.GetCollectionByIdInput) (*dto.GetCollectionByIdOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.get(ctx, input.ID)

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
			Path:          "/collections/",
			Summary:       "Create Collection",
			Description:   "Create a collection",
			DefaultStatus: http.StatusCreated,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActCollectionCRUD),
			},
			Security: core.OpenApiJwtSecurity,
			Errors:   []int{400, 401, 403, 409, 422, 500},
		},
		func(ctx context.Context, input *dto.CreateCollectionInput) (*dto.CreateCollectionOutput, error) {
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
			Method:        http.MethodDelete,
			Path:          "/collections/{id}",
			Summary:       "Delete Collection",
			Description:   "Delete a collection by id",
			DefaultStatus: http.StatusNoContent,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActCollectionCRUD),
			},
			Security: core.OpenApiJwtSecurity,
			Errors:   []int{400, 401, 403, 404, 422, 500},
		},
		func(ctx context.Context, input *dto.DeleteCollectionInput) (*struct{}, error) {
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
			Method:        http.MethodPatch,
			Path:          "/collections/{id}",
			Summary:       "Update Collection",
			Description:   "Update a collection by id",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActCollectionCRUD),
			},
			Security: core.OpenApiJwtSecurity,
			Errors:   []int{400, 401, 403, 404, 422, 500},
		},
		func(ctx context.Context, input *dto.UpdateCollectionInput) (*dto.UpdateCollectionOutput, error) {
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
			Method:        http.MethodPost,
			Path:          "/collections/{id}/items",
			Summary:       "Create Collection Item",
			Description:   "Add an item to a collection",
			DefaultStatus: http.StatusCreated,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActCollectionCRUD),
			},
			Security: core.OpenApiJwtSecurity,
			Errors:   []int{400, 401, 403, 404, 422, 500},
		},
		func(ctx context.Context, input *dto.CreateCollectionItemInput) (*dto.CreateCollectionItemOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.createItem(ctx, input.CollectionID, input.Body)

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
			Path:          "/collections/{id}/items/{index}",
			Summary:       "Delete Collection Item",
			Description:   "Delete a collection item by index",
			DefaultStatus: http.StatusNoContent,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActCollectionCRUD),
			},
			Security: core.OpenApiJwtSecurity,
			Errors:   []int{400, 401, 403, 404, 422, 500},
		},
		func(ctx context.Context, input *dto.DeleteCollectionItemInput) (*struct{}, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			err := s.removeItem(ctx, input.CollectionID, input.Index)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return nil, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPatch,
			Path:          "/collections/{id}/items",
			Summary:       "Update Collection Items",
			Description:   "Update the items of a collection",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActCollectionCRUD),
			},
			Security: core.OpenApiJwtSecurity,
			Errors:   []int{400, 401, 403, 404, 422, 500},
		},
		func(ctx context.Context, input *dto.UpdateCollectionItemsInput) (*dto.UpdateCollectionItemsOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.updateItems(ctx, input.CollectionID, input.Body)

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
			Path:          "/collections/{id}/poi/{poiId}",
			Summary:       "Create Collection POI Relation",
			Description:   "Create collection POI relation",
			DefaultStatus: http.StatusCreated,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActCollectionCRUD),
			},
			Security: core.OpenApiJwtSecurity,
			Errors:   []int{400, 401, 403, 404, 422, 500},
		},
		func(ctx context.Context, input *dto.CreateCollectionPoiRelationInput) (*struct{}, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			err := s.createPoiRelation(ctx, input.CollectionID, input.PoiID)

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
			Path:          "/collections/{id}/city/{cityId}",
			Summary:       "Create Collection City Relation",
			Description:   "Create collection city relation",
			DefaultStatus: http.StatusCreated,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActCollectionCRUD),
			},
			Security: core.OpenApiJwtSecurity,
			Errors:   []int{400, 401, 403, 404, 422, 500},
		},
		func(ctx context.Context, input *dto.CreateCollectionCityRelationInput) (*struct{}, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			err := s.createCityRelation(ctx, input.CollectionID, input.CityID)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return nil, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodDelete,
			Path:          "/collections/{id}/poi/{poiId}",
			Summary:       "Delete Collection POI Relation",
			Description:   "Delete collection POI relation",
			DefaultStatus: http.StatusNoContent,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActCollectionCRUD),
			},
			Security: core.OpenApiJwtSecurity,
			Errors:   []int{400, 401, 403, 404, 422, 500},
		},
		func(ctx context.Context, input *dto.RemoveCollectionPoiRelationInput) (*struct{}, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			err := s.removePoiRelation(ctx, input.CollectionID, input.PoiID)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return nil, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodDelete,
			Path:          "/collections/{id}/city/{cityId}",
			Summary:       "Delete Collection city Relation",
			Description:   "Delete collection city relation",
			DefaultStatus: http.StatusNoContent,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActCollectionCRUD),
			},
			Security: core.OpenApiJwtSecurity,
			Errors:   []int{400, 401, 403, 404, 422, 500},
		},
		func(ctx context.Context, input *dto.RemoveCollectionCityRelationInput) (*struct{}, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			err := s.removeCityRelation(ctx, input.CollectionID, input.CityID)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return nil, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/collections/poi/{id}",
			Summary:       "Get Collections For a POI",
			Description:   "Get collections for a POI",
			DefaultStatus: http.StatusOK,
			Errors:        []int{400, 404, 422, 500},
		},
		func(ctx context.Context, input *dto.GetCollectionsForPoiInput) (*dto.GetCollectionsForPoiOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.listPoiCollections(ctx, input.PoiID)

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
			Path:          "/collections/city/{id}",
			Summary:       "Get Collections For a City",
			Description:   "Get collections for a city",
			DefaultStatus: http.StatusOK,
			Errors:        []int{400, 404, 422, 500},
		},
		func(ctx context.Context, input *dto.GetCollectionsForCityInput) (*dto.GetCollectionsForCityOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.listCityCollections(ctx, input.CityID)

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
			Path:          "/collections/poi/all",
			Summary:       "Get All POI Collections",
			Description:   "Get all POI collections",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActCollectionCRUD),
			},
			Security: core.OpenApiJwtSecurity,
			Errors:   []int{400, 401, 403, 404, 422, 500},
		},
		func(ctx context.Context, input *struct{}) (*dto.GetAllPoiCollectionsOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.listAllPoiCollections(ctx)

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
			Path:          "/collections/city/all",
			Summary:       "Get All City Collections",
			Description:   "Get all city collections",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActCollectionCRUD),
			},
			Security: core.OpenApiJwtSecurity,
			Errors:   []int{400, 401, 403, 404, 422, 500},
		},
		func(ctx context.Context, input *struct{}) (*dto.GetAllCityCollectionsOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.listAllCityCollections(ctx)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

}
