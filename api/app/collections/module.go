package collections

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
		},
		func(ctx context.Context, input *dto.GetCollectionsInput) (*dto.GetCollectionsOutput, error) {
			res, err := s.list(input.PaginationQueryParams)

			if err != nil {
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
		},
		func(ctx context.Context, input *dto.GetCollectionByIdInput) (*dto.GetCollectionByIdOutput, error) {
			res, err := s.getById(input.ID)

			if err != nil {
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
		},
		func(ctx context.Context, input *dto.CreateCollectionInput) (*dto.CreateCollectionOutput, error) {
			res, err := s.create(input.Body)

			if err != nil {
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
		},
		func(ctx context.Context, input *dto.DeleteCollectionInput) (*struct{}, error) {
			err := s.remove(input.ID)

			if err != nil {
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
		},
		func(ctx context.Context, input *dto.UpdateCollectionInput) (*dto.UpdateCollectionOutput, error) {
			res, err := s.update(input.ID, input.Body)

			if err != nil {
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
		},
		func(ctx context.Context, input *dto.CreateCollectionItemInput) (*dto.CreateCollectionItemOutput, error) {
			res, err := s.createItem(input.CollectionID, input.Body)

			if err != nil {
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
		},
		func(ctx context.Context, input *dto.DeleteCollectionItemInput) (*struct{}, error) {
			err := s.removeItem(input.CollectionID, input.Index)

			if err != nil {
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
		},
		func(ctx context.Context, input *dto.UpdateCollectionItemsInput) (*dto.UpdateCollectionItemsOutput, error) {
			res, err := s.updateItems(input.CollectionID, input.Body)

			if err != nil {
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
		},
		func(ctx context.Context, input *dto.CreateCollectionPoiRelationInput) (*struct{}, error) {
			err := s.createPoiRelation(input.CollectionID, input.PoiID)

			if err != nil {
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
		},
		func(ctx context.Context, input *dto.CreateCollectionCityRelationInput) (*struct{}, error) {
			err := s.createCityRelation(input.CollectionID, input.CityID)

			if err != nil {
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
		},
		func(ctx context.Context, input *dto.RemoveCollectionPoiRelationInput) (*struct{}, error) {
			err := s.removePoiRelation(input.CollectionID, input.PoiID)

			if err != nil {
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
		},
		func(ctx context.Context, input *dto.RemoveCollectionCityRelationInput) (*struct{}, error) {
			err := s.removeCityRelation(input.CollectionID, input.CityID)

			if err != nil {
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
		},
		func(ctx context.Context, input *dto.GetCollectionsForPoiInput) (*dto.GetCollectionsForPoiOutput, error) {
			res, err := s.getCollectionsForPoi(input.PoiID)

			if err != nil {
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
		},
		func(ctx context.Context, input *dto.GetCollectionsForCityInput) (*dto.GetCollectionsForCityOutput, error) {
			res, err := s.getCollectionsForCity(input.CityID)

			if err != nil {
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
		},
		func(ctx context.Context, input *struct{}) (*dto.GetAllPoiCollectionsOutput, error) {
			res, err := s.getAllPoiCollections()

			if err != nil {
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
		},
		func(ctx context.Context, input *struct{}) (*dto.GetAllCityCollectionsOutput, error) {
			res, err := s.getAllCityCollections()

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)

}
