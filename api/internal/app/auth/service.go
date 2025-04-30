package auth

import (
	"context"
	"fmt"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/dto"
	"wanderlust/internal/pkg/hash"
	"wanderlust/internal/pkg/utils"

	"github.com/jackc/pgx/v5/pgtype"
)

type Service struct {
	app *core.Application
}

func (s *Service) getUserByEmail(email string) (db.User, error) {
	return s.app.Db.Queries.GetUserByEmail(context.Background(), email)
}

func (s *Service) checkIfEmailOrUsernameIsTaken(email, username string) error {
	// Check if email is taken
	dbUser, err := s.getUserByEmail(email)

	if err == nil && dbUser.Email != "" {
		return fmt.Errorf("email %s is already taken", email)
	}

	// Check if username is taken
	dbUser, err = s.app.Db.Queries.GetUserByUsername(context.Background(), username)

	if err == nil && dbUser.Username != "" {
		return fmt.Errorf("username %s is already taken", username)
	}

	return nil
}

func (s *Service) createUserFromCredentialsInfo(dto dto.RegisterInputBody) (*db.User, error) {
	hashed, err := hash.Hash(dto.Password)

	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %v", err)
	}

	saved, err := s.app.Db.Queries.CreateUser(context.Background(), db.CreateUserParams{
		ID:                    utils.GenerateId(s.app.Flake),
		Email:                 dto.Email,
		FullName:              dto.FullName,
		Username:              dto.Username,
		PasswordHash:          pgtype.Text{String: hashed, Valid: true},
		GoogleID:              pgtype.Text{},
		FbID:                  pgtype.Text{},
		IsEmailVerified:       false,
		IsOnboardingCompleted: true,
		ProfileImage:          pgtype.Text{},
	})

	if err != nil {
		return nil, err
	}

	return &saved, nil
}
