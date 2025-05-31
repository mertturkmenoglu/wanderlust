package authz

import "github.com/danielgtaylor/huma/v2"

type AuthzAct string

type AuthzFn func(s *Authz, c huma.Context) (bool, error)

const (
	ActAmenityUpdate    AuthzAct = "amenity.update"
	ActAmenityCreate    AuthzAct = "amenity.create"
	ActAmenityDelete    AuthzAct = "amenity.delete"
	ActCategoryCreate   AuthzAct = "category.create"
	ActCategoryDelete   AuthzAct = "category.delete"
	ActCategoryUpdate   AuthzAct = "category.update"
	ActCityCreate       AuthzAct = "city.create"
	ActCityDelete       AuthzAct = "city.delete"
	ActCityUpdate       AuthzAct = "city.update"
	ActUserMakeVerified AuthzAct = "user.make-verified"
	ActPoiDraftCreate   AuthzAct = "poi.draft.create"
	ActPoiDraftRead     AuthzAct = "poi.draft.read"
	ActPoiDraftUpdate   AuthzAct = "poi.draft.update"
	ActCollectionCRUD   AuthzAct = "collection.crud"
	ActReportCRUD       AuthzAct = "report.crud"
)

var Fns = map[AuthzAct]AuthzFn{
	ActCityCreate:       IsAdmin,
	ActCityDelete:       IsAdmin,
	ActCityUpdate:       IsAdmin,
	ActAmenityUpdate:    IsAdmin,
	ActAmenityCreate:    IsAdmin,
	ActAmenityDelete:    IsAdmin,
	ActCategoryCreate:   IsAdmin,
	ActCategoryDelete:   IsAdmin,
	ActCategoryUpdate:   IsAdmin,
	ActUserMakeVerified: IsAdmin,
	ActPoiDraftCreate:   IsAdmin,
	ActPoiDraftRead:     IsAdmin,
	ActPoiDraftUpdate:   IsAdmin,
	ActCollectionCRUD:   IsAdmin,
	ActReportCRUD:       IsAdmin,
}
