package auth

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"time"
	"wanderlust/pkg/cfg"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/hash"
	"wanderlust/pkg/random"
	"wanderlust/pkg/tasks"
	"wanderlust/pkg/tokens"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/utils"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Service struct {
	*core.Application
	db   *db.Queries
	pool *pgxpool.Pool
}

func (s *Service) find(ctx context.Context, id string) (*db.User, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.db.GetUserById(ctx, id)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("User not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get user by id")
	}

	return &res, nil
}

func (s *Service) findByEmail(ctx context.Context, email string) (*db.User, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.db.GetUserByEmail(ctx, email)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("User not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get user by email")
	}

	return &res, nil
}

func (s *Service) findByUsername(ctx context.Context, username string) (*db.User, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.db.GetUserByUsername(ctx, username)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("User not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get user by username")
	}

	return &res, nil
}

func (s *Service) getMe(ctx context.Context) (*dto.GetMeOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	user, err := s.find(ctx, userId)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	return &dto.GetMeOutput{
		Body: dto.GetMeOutputBody{
			ID:             user.ID,
			Email:          user.Email,
			Username:       user.Username,
			FullName:       user.FullName,
			GoogleID:       utils.TextToStr(user.GoogleID),
			FacebookID:     utils.TextToStr(user.FbID),
			IsVerified:     user.IsVerified,
			Bio:            utils.TextToStr(user.Bio),
			Pronouns:       utils.TextToStr(user.Pronouns),
			Website:        utils.TextToStr(user.Website),
			ProfileImage:   utils.TextToStr(user.ProfileImage),
			BannerImage:    utils.TextToStr(user.BannerImage),
			FollowersCount: user.FollowersCount,
			FollowingCount: user.FollowingCount,
			CreatedAt:      user.CreatedAt.Time,
			UpdatedAt:      user.UpdatedAt.Time,
		},
	}, nil
}

func (s *Service) login(ctx context.Context, body dto.LoginInputBody) (*dto.LoginOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	user, dbErr := s.findByEmail(ctx, body.Email)
	var hashed = ""

	if dbErr == nil {
		hashed = user.PasswordHash.String
	}

	matched, verifyErr := hash.Verify(body.Password, hashed)

	// If the passwords don't match, or there's an error, return a generic error message.
	if !matched || dbErr != nil || verifyErr != nil {
		return nil, huma.Error400BadRequest("Invalid email or password")
	}

	role, err := s.getUserRole(ctx, user.ID)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	accessToken, refreshToken, err := tokens.CreateAuthTokens(tokens.UserInformation{
		ID:       user.ID,
		Username: user.Username,
		Role:     role,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create JWT")
	}

	return &dto.LoginOutput{
		SetCookie: []http.Cookie{
			{
				Name:     tokens.AccessTokenCookieName,
				Value:    accessToken,
				MaxAge:   60 * 60 * 24 * 30, // 30 days
				Path:     "/",
				HttpOnly: true,
				Secure:   cfg.Env.Env != "dev",
				SameSite: http.SameSiteLaxMode,
			},
			{
				Name:     tokens.RefreshTokenCookieName,
				Value:    refreshToken,
				MaxAge:   60 * 60 * 24 * 30, // 30 days
				Path:     "/",
				HttpOnly: true,
				Secure:   cfg.Env.Env != "dev",
				SameSite: http.SameSiteLaxMode,
			},
		},
	}, nil

}

func (s *Service) logout(ctx context.Context) (*dto.LogoutOutput, error) {
	_, sp := tracing.NewSpan(ctx)
	defer sp.End()

	return &dto.LogoutOutput{
		SetCookie: []http.Cookie{
			{
				Name:    tokens.AccessTokenCookieName,
				Value:   "",
				MaxAge:  -1,
				Path:    "/",
				Expires: time.Unix(0, 0),
			},
			{
				Name:    tokens.RefreshTokenCookieName,
				Value:   "",
				MaxAge:  -1,
				Path:    "/",
				Expires: time.Unix(0, 0),
			},
		},
	}, nil
}

func (s *Service) refresh(ctx context.Context, cookieRefreshToken string) (*dto.RefreshOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	// Try to decode refresh token
	// Also check its integrity and validity
	refreshTokenData, err := tokens.DecodeRefreshToken(cookieRefreshToken)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error401Unauthorized("Invalid refresh token")
	}

	// Check Redis cache for the refrest token
	// If it's not there, it means the token is invalid or expired.
	_, err = s.Application.Cache.Get(ctx, "refresh:"+refreshTokenData.ID).Result()

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error401Unauthorized("Invalid refresh token")
	}

	userId := refreshTokenData.UserID
	user, err := s.find(ctx, userId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get user by id")
	}

	authTokens, err := tokens.CreateAuthTokens(tokens.UserInformation{
		ID:       user.ID,
		Username: user.Username,
		Role:     refreshTokenData.Role,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create JWT")
	}

	// Delete previous refresh token from cache
	err = s.Application.Cache.Del(ctx, "refresh:"+refreshTokenData.ID).Err()

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to delete refresh token from cache")
	}

	// Set new refresh token in cache
	err = s.Application.Cache.Set(ctx, "refresh:"+authTokens.RefreshTokenJTI, authTokens.RefreshToken, tokens.RefreshTokenExpiration).Err()

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to set refresh token in cache")
	}

	return &dto.RefreshOutput{
		SetCookie: []http.Cookie{
			{
				Name:     tokens.AccessTokenCookieName,
				Value:    authTokens.AccessToken,
				MaxAge:   tokens.AccessTokenMaxAge,
				Path:     "/",
				HttpOnly: true,
				Secure:   cfg.Env.Env != "dev",
				SameSite: http.SameSiteLaxMode,
			},
			{
				Name:     tokens.RefreshTokenCookieName,
				Value:    authTokens.RefreshToken,
				MaxAge:   tokens.RefreshTokenMaxAge,
				Path:     "/",
				HttpOnly: true,
				Secure:   cfg.Env.Env != "dev",
				SameSite: http.SameSiteLaxMode,
			},
		},
	}, nil
}

func (s *Service) register(ctx context.Context, body dto.RegisterInputBody) (*dto.RegisterOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	taken := s.checkIfEmailOrUsernameIsTaken(ctx, body.Email, body.Username)

	if taken {
		err := huma.Error409Conflict("Email or username already taken")
		return nil, err
	}

	ok := isValidUsername(body.Username)

	if !ok {
		err := huma.Error422UnprocessableEntity("Username must include only alphanumeric characters or underscore")
		return nil, err
	}

	saved, err := s.createUserFromCredentialsInfo(ctx, body)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create user")
	}

	return &dto.RegisterOutput{
		Body: dto.RegisterOutputBody{
			ID:        saved.ID,
			Email:     saved.Email,
			Username:  saved.Username,
			FullName:  saved.FullName,
			CreatedAt: saved.CreatedAt.Time,
			UpdatedAt: saved.UpdatedAt.Time,
		},
	}, nil
}

func (s *Service) checkIfEmailOrUsernameIsTaken(ctx context.Context, email, username string) bool {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	// Check if email is taken
	dbUser, err := s.findByEmail(ctx, email)

	if err == nil && dbUser.Email != "" {
		return true
	}

	// Check if username is taken
	dbUser, err = s.findByUsername(ctx, username)

	if err == nil && dbUser.Username != "" {
		return true
	}

	return false
}

func (s *Service) createUserFromCredentialsInfo(ctx context.Context, dto dto.RegisterInputBody) (*db.User, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	hashed, err := hash.Hash(dto.Password)

	if err != nil {
		sp.RecordError(err)
		return nil, fmt.Errorf("failed to hash password: %v", err)
	}

	saved, err := s.db.CreateUser(ctx, db.CreateUserParams{
		ID:           s.ID.Flake(),
		Email:        dto.Email,
		FullName:     dto.FullName,
		Username:     dto.Username,
		PasswordHash: pgtype.Text{String: hashed, Valid: true},
		GoogleID:     pgtype.Text{},
		FbID:         pgtype.Text{},
		ProfileImage: pgtype.Text{},
	})

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	return &saved, nil
}

func (s *Service) sendForgotPasswordEmail(ctx context.Context, email string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	user, err := s.findByEmail(ctx, email)

	if err != nil {
		sp.RecordError(err)
		err := huma.Error422UnprocessableEntity("Invalid email")
		return err
	}

	code, err := random.DigitsString(6)

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("Failed to generate verification code")
	}

	key := "forgot-password:" + code
	err = s.Cache.Set(ctx, key, user.Email, time.Minute*15).Err()

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("Failed to set verification code in cache")
	}

	_, err = s.Tasks.CreateAndEnqueue(tasks.Job{
		Type: tasks.TypeForgotPasswordEmail,
		Data: tasks.ForgotPasswordEmailPayload{
			Email: user.Email,
			Code:  code,
		},
	})

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("Failed to enqueue forgot password email task")
	}

	return nil
}

func (s *Service) resetPassword(ctx context.Context, body dto.ResetPasswordInputBody) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	user, err := s.findByEmail(ctx, body.Email)

	if err != nil {
		sp.RecordError(err)
		err := huma.Error422UnprocessableEntity("Invalid email")
		return err
	}

	key := "forgot-password:" + body.Code
	cacheVal, err := s.Cache.Get(ctx, key).Result()

	if err != nil {
		sp.RecordError(err)
		err := huma.Error422UnprocessableEntity("Invalid or expired verification code")
		return err
	}

	if cacheVal != user.Email {
		err := huma.Error422UnprocessableEntity("Invalid or expired verification code")
		sp.RecordError(err)
		return err
	}

	hashed, err := hash.Hash(body.NewPassword)

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("Failed to hash password")
	}

	err = s.db.UpdateUserPassword(ctx, db.UpdateUserPasswordParams{
		ID:           user.ID,
		PasswordHash: pgtype.Text{String: hashed, Valid: true},
	})

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("Failed to update password")
	}

	err = s.Cache.Del(ctx, key).Err()

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("Failed to delete verification code from cache")
	}

	return nil
}

func (s *Service) startOAuthFlow(ctx context.Context, provider string) (*dto.OAuthOutput, error) {
	_, sp := tracing.NewSpan(ctx)
	defer sp.End()

	state, url, err := getOAuthStateAndRedirectUrl(provider)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create OAuth state")
	}

	c := &http.Cookie{
		Name:     "state",
		Value:    state,
		Path:     "/",
		MaxAge:   int(time.Hour.Seconds()),
		Secure:   false,
		HttpOnly: true,
	}

	return &dto.OAuthOutput{
		Status: http.StatusTemporaryRedirect,
		Url:    url,
		Cookie: c.String(),
	}, nil
}

func (s *Service) oauthCallback(ctx context.Context, input *dto.OAuthCallbackInput) (*dto.OAuthCallbackOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	token, err := getOAuthToken(ctx, getOAuthTokenParams{
		provider:    input.Provider,
		state:       input.QueryState,
		code:        input.Code,
		cookieState: input.CookieState,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get OAuth token")
	}

	userInfo, err := fetchUserInfo(ctx, input.Provider, token)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to fetch user info")
	}

	user, err := s.getOrCreateUserFromOAuthUser(ctx, userInfo)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create user")
	}

	role, err := s.getUserRole(ctx, user.ID)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	accessToken, refreshToken, err := tokens.CreateAuthTokens(tokens.UserInformation{
		ID:       user.ID,
		Username: user.Username,
		Role:     role,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create JWT")
	}

	return &dto.OAuthCallbackOutput{
		SetCookie: []http.Cookie{
			{
				Name:    "state",
				Value:   "",
				MaxAge:  -1,
				Path:    "/",
				Expires: time.Unix(0, 0),
			},
			{
				Name:     tokens.AccessTokenCookieName,
				Value:    accessToken,
				MaxAge:   60 * 60 * 24 * 30, // 30 days
				Path:     "/",
				HttpOnly: true,
				Secure:   cfg.Env.Env != "dev",
				SameSite: http.SameSiteLaxMode,
			},
			{
				Name:     tokens.RefreshTokenCookieName,
				Value:    refreshToken,
				MaxAge:   60 * 60 * 24 * 30, // 30 days
				Path:     "/",
				HttpOnly: true,
				Secure:   cfg.Env.Env != "dev",
				SameSite: http.SameSiteLaxMode,
			},
		},
		Status: http.StatusTemporaryRedirect,
		Url:    cfg.Env.OAuthRedirect,
	}, nil
}

func (s *Service) getUserBySocialId(ctx context.Context, provider string, id string) (*db.User, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	switch provider {
	case "google":
		{

			user, err := s.db.GetUserByGoogleId(ctx, pgtype.Text{String: id, Valid: true})
			if err != nil {
				sp.RecordError(err)
				return nil, err
			}
			return &user, nil
		}
	case "facebook":
		{

			user, err := s.db.GetUserByFbId(ctx, pgtype.Text{String: id, Valid: true})
			if err != nil {
				sp.RecordError(err)
				return nil, err
			}
			return &user, nil
		}
	default:
		panic("Invalid provider")
	}
}

func (s *Service) getOrCreateUserFromOAuthUser(ctx context.Context, user *oauthUser) (*db.User, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbUser, err := s.getUserBySocialId(ctx, user.provider, user.id)

	if err == nil {
		// User exists, return it
		return dbUser, nil
	}

	isNotFoundErr := errors.Is(err, pgx.ErrNoRows)

	// If the error is not a "not found" error, return it
	if !isNotFoundErr {
		sp.RecordError(err)
		return nil, fmt.Errorf("failed to get user by social ID: %v", err)
	}

	// If there are no rows, either user doesn't exists
	// or they are using another OAuth provider, or they are using
	// credentials login and now they logged in with OAuth.
	// Check if the user registered with the same email address
	// they have in their OAuth profile. If so, merge accounts.
	dbUser, err = s.findByEmail(ctx, user.email)

	if err == nil && dbUser.ID != "" {
		// Merge accounts
		err = s.updateUserSocialId(ctx, user.provider, dbUser.ID, user.id)

		if err != nil {
			sp.RecordError(err)
			return nil, fmt.Errorf("failed to update user social ID: %v", err)
		}

		return dbUser, nil
	}

	// User doesn't exist yet, create user
	saved, err := s.createUserFromOAuthUser(ctx, user)

	if err != nil {
		sp.RecordError(err)
		return nil, fmt.Errorf("failed to create user: %v", err)
	}

	return saved, nil
}

func (s *Service) updateUserSocialId(ctx context.Context, provider string, id string, socialId string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	switch provider {
	case "google":
		return s.db.UpdateUserGoogleId(ctx, db.UpdateUserGoogleIdParams{
			ID:       id,
			GoogleID: pgtype.Text{String: socialId, Valid: true},
		})
	case "facebook":
		return s.db.UpdateUserFbId(ctx, db.UpdateUserFbIdParams{
			ID:   id,
			FbID: pgtype.Text{String: socialId, Valid: true},
		})
	default:
		return fmt.Errorf("invalid provider: %s", provider)
	}
}

func (s *Service) createUserFromOAuthUser(ctx context.Context, oauthUser *oauthUser) (*db.User, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	username, err := generateUsernameFromEmail(ctx, s.Db, oauthUser.email)

	if err != nil {
		sp.RecordError(err)
		return nil, fmt.Errorf("failed to generate username: %v", err)
	}

	saved, err := s.db.CreateUser(ctx, db.CreateUserParams{
		ID:           s.ID.Flake(),
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
		sp.RecordError(err)
		return nil, fmt.Errorf("failed to create user from OAuth user: %v", err)
	}

	return &saved, nil
}

func (s *Service) changePassword(ctx context.Context, body dto.ChangePasswordInputBody) (*dto.ChangePasswordOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	if body.NewPassword != body.ConfirmPassword {

		err := huma.Error422UnprocessableEntity("Passwords do not match")
		sp.RecordError(err)
		return nil, err
	}

	userId := ctx.Value("userId").(string)
	user, err := s.find(ctx, userId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get user by id")
	}

	// Does user has a password?
	// If not, it means user registered with OAuth.
	// Directly let them change their password.
	// Else, check if the password is correct.
	if user.PasswordHash.Valid {
		matched, verifyErr := hash.Verify(body.CurrentPassword, user.PasswordHash.String)

		if !matched || verifyErr != nil {
			err := huma.Error422UnprocessableEntity("Invalid password")
			sp.RecordError(err)
			return nil, err
		}
	}

	hashed, err := hash.Hash(body.NewPassword)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to hash password")
	}

	err = s.db.UpdateUserPassword(ctx, db.UpdateUserPasswordParams{
		ID:           user.ID,
		PasswordHash: pgtype.Text{String: hashed, Valid: true},
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to update password")
	}

	role, err := s.getUserRole(ctx, user.ID)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	accessToken, refreshToken, err := tokens.CreateAuthTokens(tokens.UserInformation{
		ID:       user.ID,
		Username: user.Username,
		Role:     role,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create JWT")
	}

	return &dto.ChangePasswordOutput{
		SetCookie: []http.Cookie{
			{
				Name:     tokens.AccessTokenCookieName,
				Value:    accessToken,
				MaxAge:   60 * 60 * 24 * 30, // 30 days
				Path:     "/",
				HttpOnly: true,
				Secure:   cfg.Env.Env != "dev",
				SameSite: http.SameSiteLaxMode,
			},
			{
				Name:     tokens.RefreshTokenCookieName,
				Value:    refreshToken,
				MaxAge:   60 * 60 * 24 * 30, // 30 days
				Path:     "/",
				HttpOnly: true,
				Secure:   cfg.Env.Env != "dev",
				SameSite: http.SameSiteLaxMode,
			},
		},
	}, nil
}

func (s *Service) getUserRole(ctx context.Context, userId string) (string, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	isAdmin, err := s.db.IsAdmin(ctx, userId)

	if err != nil {
		sp.RecordError(err)
		return "", huma.Error500InternalServerError("Failed to get user role")
	}

	role := "user"

	if isAdmin {
		role = "admin"
	}

	return role, nil
}
