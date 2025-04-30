package authz

import "github.com/danielgtaylor/huma/v2"

type AuthzAct string

type AuthzFn func(s *Authz, c huma.Context) (bool, error)

const (
	ActTest AuthzAct = "test"
)

var Fns = map[AuthzAct]AuthzFn{
	ActTest: Identity,
}
