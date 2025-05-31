package authz

import (
	"github.com/danielgtaylor/huma/v2"
)

func IsAdmin(s *Authz, c huma.Context) (bool, error) {
	userId, ok := c.Context().Value("userId").(string)

	if !ok {
		return false, huma.Error401Unauthorized("unauthorized")
	}

	res, err := s.Db.Queries.IsAdmin(c.Context(), userId)

	if err != nil {
		return false, err
	}

	return res, nil
}

func Identity(s *Authz, c huma.Context) (bool, error) {
	return true, nil
}

func NotImplemented(s *Authz, c huma.Context) (bool, error) {
	return false, huma.Error501NotImplemented("not implemented")
}
