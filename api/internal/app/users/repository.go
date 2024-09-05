package users

import (
	"context"
	"wanderlust/internal/db"
)

func (r *repository) GetUserProfile(username string) (db.GetUserProfileByUsernameRow, error) {
	return r.db.Queries.GetUserProfileByUsername(context.Background(), username)
}
