package authz

import "github.com/danielgtaylor/huma/v2"

type AuthzAct string

type AuthzFn func(s *Authz, c huma.Context) (bool, error)

const (
	ActTest           AuthzAct = "test"
	ActCityCreate     AuthzAct = "city.create"
	ActCityDelete     AuthzAct = "city.delete"
	ActCityUpdate     AuthzAct = "city.update"
	ActAmenityUpdate  AuthzAct = "amenity.update"
	ActAmenityCreate  AuthzAct = "amenity.create"
	ActAmenityDelete  AuthzAct = "amenity.delete"
	ActCategoryCreate AuthzAct = "category.create"
	ActCategoryDelete AuthzAct = "category.delete"
	ActCategoryUpdate AuthzAct = "category.update"
)

var Fns = map[AuthzAct]AuthzFn{
	ActTest:           Identity,
	ActCityCreate:     IsAdmin,
	ActCityDelete:     IsAdmin,
	ActCityUpdate:     IsAdmin,
	ActAmenityUpdate:  IsAdmin,
	ActAmenityCreate:  IsAdmin,
	ActAmenityDelete:  IsAdmin,
	ActCategoryCreate: IsAdmin,
	ActCategoryDelete: IsAdmin,
	ActCategoryUpdate: IsAdmin,
}
