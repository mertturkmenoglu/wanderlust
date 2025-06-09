package export

import "context"

func isAdmin(ctx context.Context) bool {
	return ctx.Value("role") == "admin"
}
