package authz

import "github.com/danielgtaylor/huma/v2"

type AuthzAct string

type AuthzFn func(s *Authz, c huma.Context) (bool, error)

const (
	ActTest AuthzAct = "test"

	ActAmenityUpdate    AuthzAct = "amenity.update"
	ActAmenityCreate    AuthzAct = "amenity.create"
	ActAmenityDelete    AuthzAct = "amenity.delete"
	ActCategoryCreate   AuthzAct = "category.create"
	ActCategoryDelete   AuthzAct = "category.delete"
	ActCategoryUpdate   AuthzAct = "category.update"
	ActCityCreate       AuthzAct = "city.create"
	ActCityDelete       AuthzAct = "city.delete"
	ActCityUpdate       AuthzAct = "city.update"
	ActListRead         AuthzAct = "list.read"
	ActListStatusRead   AuthzAct = "list.status.read"
	ActListUpdate       AuthzAct = "list.update"
	ActListDelete       AuthzAct = "list.delete"
	ActListItemCreate   AuthzAct = "list.item.create"
	ActListItemDelete   AuthzAct = "list.item.delete"
	ActListItemUpdate   AuthzAct = "list.item.update"
	ActUserMakeVerified AuthzAct = "user.make-verified"
	ActPoiDraftCreate   AuthzAct = "poi.draft.create"
	ActPoiDraftRead     AuthzAct = "poi.draft.read"
)

var Fns = map[AuthzAct]AuthzFn{
	ActTest:             Identity,
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
	ActListRead:         FnListRead,
	ActListStatusRead:   Identity,
	ActListUpdate:       FnListUpdate,
	ActListDelete:       FnListDelete,
	ActListItemCreate:   FnListItemCreate,
	ActListItemDelete:   NotImplemented,
	ActPoiDraftCreate:   IsAdmin,
	ActPoiDraftRead:     IsAdmin,
}
