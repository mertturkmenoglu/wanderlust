package pois

import "context"

func isAdmin(ctx context.Context) bool {
	role := ctx.Value("role").(string)
	return role == "admin"
}
