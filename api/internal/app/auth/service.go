package auth

import (
	"context"
	"errors"
	"fmt"
	"wanderlust/internal/pkg/cfg"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/dto"
	"wanderlust/internal/pkg/hash"
	"wanderlust/internal/pkg/utils"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
)

type Service struct {
	app *core.Application
}

func (s *Service) getUserByEmail(ctx context.Context, email string) (db.User, error) {
	sp := utils.NewSpan(ctx, utils.GetFnName())
	defer sp.End()
	return s.app.Db.Queries.GetUserByEmail(context.Background(), email)
}

func (s *Service) checkIfEmailOrUsernameIsTaken(email, username string) error {
	// Check if email is taken
	dbUser, err := s.getUserByEmail(context.Background(), email)

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

func (s *Service) getUserBySocialId(provider string, id string) (db.User, error) {
	switch provider {
	case "google":
		return s.app.Db.Queries.GetUserByGoogleId(context.Background(), pgtype.Text{String: id, Valid: true})
	case "facebook":
		return s.app.Db.Queries.GetUserByFbId(context.Background(), pgtype.Text{String: id, Valid: true})
	default:
		panic("Invalid provider")
	}
}

func (s *Service) getOrCreateUserFromOAuthUser(user *oauthUser) (*db.User, error) {
	dbUser, err := s.getUserBySocialId(user.provider, user.id)

	if err == nil {
		// User exists, return ID
		return &dbUser, nil
	}

	// If the error is not a "not found" error, return it
	if !errors.Is(err, pgx.ErrNoRows) {
		return nil, fmt.Errorf("failed to get user by social ID: %v", err)
	}

	// If there are no rows, either user doesn't exists
	// or they are using another OAuth provider, or they are using
	// credentials login and now they logged in with OAuth.
	// Check if the user registered with the same email address
	// they have in their OAuth profile. If so, merge accounts.
	dbUser, err = s.getUserByEmail(context.Background(), user.email)

	if err == nil && dbUser.ID != "" {
		// Merge accounts
		err = s.updateUserSocialId(user.provider, dbUser.ID, user.id)

		if err != nil {
			return nil, fmt.Errorf("failed to update user social ID: %v", err)
		}

		return &dbUser, nil
	}

	// User doesn't exist yet, create user
	saved, err := s.createUserFromOAuthUser(user)

	if err != nil {
		return nil, fmt.Errorf("failed to create user: %v", err)
	}

	return saved, nil
}

func (s *Service) updateUserSocialId(provider string, id string, socialId string) error {
	switch provider {
	case "google":
		return s.app.Db.Queries.UpdateUserGoogleId(context.Background(), db.UpdateUserGoogleIdParams{
			ID:       id,
			GoogleID: pgtype.Text{String: socialId, Valid: true},
		})
	case "facebook":
		return s.app.Db.Queries.UpdateUserFbId(context.Background(), db.UpdateUserFbIdParams{
			ID:   id,
			FbID: pgtype.Text{String: socialId, Valid: true},
		})
	default:
		return fmt.Errorf("invalid provider: %s", provider)
	}
}

func (s *Service) createUserFromOAuthUser(oauthUser *oauthUser) (*db.User, error) {
	username, err := generateUsernameFromEmail(s.app.Db, oauthUser.email)

	if err != nil {
		return nil, fmt.Errorf("failed to generate username: %v", err)
	}

	saved, err := s.app.Db.Queries.CreateUser(context.Background(), db.CreateUserParams{
		ID:                    utils.GenerateId(s.app.Flake),
		Email:                 oauthUser.email,
		Username:              username,
		FullName:              oauthUser.name,
		PasswordHash:          pgtype.Text{},
		GoogleID:              pgtype.Text{String: oauthUser.id, Valid: oauthUser.provider == "google"},
		FbID:                  pgtype.Text{String: oauthUser.id, Valid: oauthUser.provider == "facebook"},
		IsEmailVerified:       true,
		IsOnboardingCompleted: false,
		ProfileImage:          pgtype.Text{String: oauthUser.picture, Valid: true},
	})

	if err != nil {
		return nil, fmt.Errorf("failed to create user from OAuth user: %v", err)
	}

	return &saved, nil
}

func (s *Service) getEmailVerifyUrl(code string) string {
	return fmt.Sprintf(
		"%s/api/v2/auth/verify-email/verify?code=%s",
		cfg.Get(cfg.API_URL),
		code,
	)
}

func (s *Service) verifyUserEmail(userId string) error {
	return s.app.Db.Queries.UpdateUserIsEmailVerified(context.Background(), db.UpdateUserIsEmailVerifiedParams{
		ID:              userId,
		IsEmailVerified: true,
	})
}

func (s *Service) updateUserPassword(userId string, plainPassword string) error {
	hashed, err := hash.Hash(plainPassword)

	if err != nil {
		return fmt.Errorf("failed to hash password: %v", err)
	}

	return s.app.Db.Queries.UpdateUserPassword(context.Background(), db.UpdateUserPasswordParams{
		ID:           userId,
		PasswordHash: pgtype.Text{String: hashed, Valid: true},
	})
}
