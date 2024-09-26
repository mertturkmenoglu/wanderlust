package users

import (
	"context"
	"wanderlust/internal/db"
)

func (r *repository) GetUserProfile(username string) (db.GetUserProfileByUsernameRow, error) {
	return r.db.Queries.GetUserProfileByUsername(context.Background(), username)
}

func (r *repository) makeUserVerified(id string) error {
	return r.db.Queries.MakeUserVerified(context.Background(), id)
}
