package authz

import "github.com/danielgtaylor/huma/v2"

type AuthzAct string

type AuthzFn func(s *Authz, c huma.Context) (bool, error)

const (
	ActTest       AuthzAct = "test"
	ActCityCreate AuthzAct = "city.create"
	ActCityDelete AuthzAct = "city.delete"
	ActCityUpdate AuthzAct = "city.update"
)

var Fns = map[AuthzAct]AuthzFn{
	ActTest:       Identity,
	ActCityCreate: IsAdmin,
	ActCityDelete: IsAdmin,
	ActCityUpdate: IsAdmin,
}
