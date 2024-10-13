package auth

import (
	"context"
	"time"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/hash"
	"wanderlust/internal/pkg/utils"

	"github.com/jackc/pgx/v5/pgtype"
)

func (r *repository) getUserBySocialId(provider string, id string) (db.User, error) {
	switch provider {
	case "google":
		return r.getUserByGoogleId(id)
	case "facebook":
		return r.getUserByFacebookId(id)
	default:
		panic("Invalid provider")
	}
}

func (r *repository) getUserByGoogleId(id string) (db.User, error) {
	return r.db.Queries.GetUserByGoogleId(
		context.Background(),
		pgtype.Text{String: id, Valid: true},
	)
}

func (r *repository) getUserByFacebookId(id string) (db.User, error) {
	return r.db.Queries.GetUserByFbId(
		context.Background(),
		pgtype.Text{String: id, Valid: true},
	)
}

func (r *repository) getUserByEmail(email string) (db.User, error) {
	return r.db.Queries.GetUserByEmail(
		context.Background(),
		email,
	)
}

func (r *repository) updateUserSocialId(provider string, id string, socialId string) error {
	switch provider {
	case "google":
		return r.updateUserGoogleId(id, socialId)
	case "facebook":
		return r.updateUserFbId(id, socialId)
	default:
		panic("Invalid provider")
	}
}

func (r *repository) updateUserGoogleId(id string, googleId string) error {
	return r.db.Queries.UpdateUserGoogleId(
		context.Background(),
		db.UpdateUserGoogleIdParams{
			ID:       id,
			GoogleID: pgtype.Text{String: googleId, Valid: true},
		},
	)
}

func (r *repository) updateUserFbId(id string, fbId string) error {
	return r.db.Queries.UpdateUserFbId(
		context.Background(),
		db.UpdateUserFbIdParams{
			ID:   id,
			FbID: pgtype.Text{String: fbId, Valid: true},
		},
	)
}

func (r *repository) createUser(oauthUser *oauthUser) (string, error) {
	username, err := generateUsernameFromEmail(r.db, oauthUser.email)

	if err != nil {
		return "", err
	}

	saved, err := r.db.Queries.CreateUser(context.Background(), db.CreateUserParams{
		ID:                    utils.GenerateId(r.flake),
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
		return "", err
	}

	return saved.ID, nil
}

func (r *repository) createSession(sessionId string, userId string) error {
	createdAt := time.Now()
	expiresAt := createdAt.Add(time.Hour * 24 * 7)

	_, err := r.db.Queries.CreateSession(
		context.Background(),
		db.CreateSessionParams{
			ID:          sessionId,
			UserID:      userId,
			SessionData: pgtype.Text{},
			CreatedAt:   pgtype.Timestamptz{Time: createdAt, Valid: true},
			ExpiresAt:   pgtype.Timestamptz{Time: expiresAt, Valid: true},
		},
	)

	return err
}

func (r *repository) getUserByUsername(username string) (db.User, error) {
	return r.db.Queries.GetUserByUsername(
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

	saved, err := r.db.Queries.CreateUser(context.Background(), db.CreateUserParams{
		ID:                    utils.GenerateId(r.flake),
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
	return r.db.Queries.UpdateUserIsEmailVerified(
		context.Background(),
		db.UpdateUserIsEmailVerifiedParams{
			ID:              userId,
			IsEmailVerified: true,
		},
	)
}

func (r *repository) updateUserPassword(userId string, hashed string) error {
	return r.db.Queries.UpdateUserPassword(
		context.Background(),
		db.UpdateUserPasswordParams{
			ID:           userId,
			PasswordHash: pgtype.Text{String: hashed, Valid: true},
		},
	)
}
