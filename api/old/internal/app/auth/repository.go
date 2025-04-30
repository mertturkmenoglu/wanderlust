package auth

import (
	"context"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/hash"
	"wanderlust/internal/pkg/utils"

	"github.com/jackc/pgx/v5/pgtype"
)

func (r *repository) getUserByUsername(username string) (db.User, error) {
	return r.di.Db.Queries.GetUserByUsername(
		context.Background(),
		username,
	)
}

func (r *repository) createUserFromCredentialsInfo(dto RegisterRequestDto) (*db.User, error) {
	// Hash password
	hashed, err := hash.Hash(dto.Password)

	if err != nil {
		return nil, ErrHash
	}

	saved, err := r.di.Db.Queries.CreateUser(context.Background(), db.CreateUserParams{
		ID:                    utils.GenerateId(r.di.Flake),
		Email:                 dto.Email,
		Username:              dto.Username,
		FullName:              dto.FullName,
		PasswordHash:          pgtype.Text{String: hashed, Valid: true},
		GoogleID:              pgtype.Text{},
		FbID:                  pgtype.Text{},
		IsEmailVerified:       false,
		IsOnboardingCompleted: true,
		ProfileImage:          pgtype.Text{},
	})

	return &saved, err
}

func (r *repository) verifyUserEmail(userId string) error {
	return r.di.Db.Queries.UpdateUserIsEmailVerified(
		context.Background(),
		db.UpdateUserIsEmailVerifiedParams{
			ID:              userId,
			IsEmailVerified: true,
		},
	)
}

func (r *repository) updateUserPassword(userId string, hashed string) error {
	return r.di.Db.Queries.UpdateUserPassword(
		context.Background(),
		db.UpdateUserPasswordParams{
			ID:           userId,
			PasswordHash: pgtype.Text{String: hashed, Valid: true},
		},
	)
}
