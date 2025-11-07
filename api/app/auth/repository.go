package auth

import (
	"context"
	"wanderlust/pkg/db"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/uid"

	"github.com/cockroachdb/errors"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	db   *db.Queries
	pool *pgxpool.Pool
}

func (r *Repository) get(ctx context.Context, id string) (*db.User, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.FindUserById(ctx, id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.Wrap(ErrNotFound, err.Error())
		}

		return nil, errors.Wrap(ErrFailedToGet, err.Error())
	}

	return &res, nil
}

func (r *Repository) getByEmail(ctx context.Context, email string) (*db.User, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.FindUserByEmail(ctx, email)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.Wrap(ErrNotFound, err.Error())
		}

		return nil, errors.Wrap(ErrFailedToGet, err.Error())
	}

	return &res, nil
}

func (r *Repository) getByUsername(ctx context.Context, username string) (*db.User, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.FindUserByUsername(ctx, username)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.Wrap(ErrNotFound, err.Error())
		}

		return nil, errors.Wrap(ErrFailedToGet, err.Error())
	}

	return &res, nil
}

func (r *Repository) getRole(ctx context.Context, userId string) (string, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	isAdmin, err := r.db.IsAdmin(ctx, userId)

	if err != nil {
		return "", errors.Wrap(ErrFailedToGetRole, err.Error())
	}

	if isAdmin {
		return "admin", nil
	}

	return "user", nil
}

func (r *Repository) checkIfEmailOrUsernameIsTaken(ctx context.Context, email, username string) (bool, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbUser, errEmail := r.getByEmail(ctx, email)

	if errEmail == nil && dbUser.Email != "" {
		return true, nil
	}

	dbUser, errUsername := r.getByUsername(ctx, username)

	if errUsername == nil && dbUser.Username != "" {
		return true, nil
	}

	return false, errors.Join(errEmail, errUsername)
}

type CreateUserParams = db.CreateUserParams

func (r *Repository) createUser(ctx context.Context, params CreateUserParams) (*db.User, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	user, err := r.db.CreateUser(ctx, params)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToCreate, err.Error())
	}

	return &user, nil
}

func (r *Repository) updatePassword(ctx context.Context, userId string, hashedPassword string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	_, err := r.db.UpdateUserPassword(ctx, db.UpdateUserPasswordParams{
		ID: userId,
		PasswordHash: pgtype.Text{
			String: hashedPassword,
			Valid:  true,
		},
	})

	if err != nil {
		return errors.Wrap(ErrFailedToHash, err.Error())
	}

	return nil
}

func (r *Repository) getUserBySocialId(ctx context.Context, provider string, id string) (*db.User, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	switch provider {
	case "google":
		{
			user, err := r.db.FindUserByGoogleId(ctx, pgtype.Text{
				String: id,
				Valid:  true,
			})

			if err != nil {
				if errors.Is(err, pgx.ErrNoRows) {
					return nil, errors.Wrap(ErrNotFound, err.Error())
				}

				return nil, errors.Wrap(ErrFailedToGet, err.Error())
			}

			return &user, nil

		}
	case "facebook":
		{
			user, err := r.db.FindUserByFbId(ctx, pgtype.Text{
				String: id,
				Valid:  true,
			})

			if err != nil {
				if errors.Is(err, pgx.ErrNoRows) {
					return nil, errors.Wrap(ErrNotFound, err.Error())
				}

				return nil, errors.Wrap(ErrFailedToGet, err.Error())
			}

			return &user, nil
		}
	default:
		panic("Invalid provider")
	}
}

func (r *Repository) updateSocialId(ctx context.Context, userId string, provider string, socialId string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	switch provider {
	case "google":
		{
			_, err := r.db.UpdateUserGoogleId(ctx, db.UpdateUserGoogleIdParams{
				ID: userId,
				GoogleID: pgtype.Text{
					String: socialId,
					Valid:  true,
				},
			})

			if err != nil {
				return errors.Wrap(ErrFailedToUpdateSocialID, err.Error())
			}

			return nil
		}
	case "facebook":
		{
			_, err := r.db.UpdateUserFbId(ctx, db.UpdateUserFbIdParams{
				ID: userId,
				FbID: pgtype.Text{
					String: socialId,
					Valid:  true,
				},
			})

			if err != nil {
				return errors.Wrap(ErrFailedToUpdateSocialID, err.Error())
			}

			return nil
		}
	default:
		panic("Invalid provider")
	}
}

func (r *Repository) createUserFromOAuthInfo(ctx context.Context, oauthUser *oauthUser, username string) (*db.User, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	user, err := r.db.CreateUser(ctx, db.CreateUserParams{
		ID:           uid.Flake(),
		Email:        oauthUser.email,
		Username:     username,
		FullName:     oauthUser.name,
		PasswordHash: pgtype.Text{},
		GoogleID: pgtype.Text{
			String: oauthUser.id,
			Valid:  oauthUser.provider == "google",
		},
		FbID: pgtype.Text{
			String: oauthUser.id,
			Valid:  oauthUser.provider == "facebook",
		},
		ProfileImage: pgtype.Text{
			String: oauthUser.picture,
			Valid:  true,
		},
	})

	if err != nil {
		return nil, errors.Wrap(ErrFailedToCreate, err.Error())
	}

	return &user, nil
}
