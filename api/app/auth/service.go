package auth

import (
	"context"
	"net/http"
	"time"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/cfg"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/durable"
	"wanderlust/pkg/hash"
	"wanderlust/pkg/random"
	"wanderlust/pkg/tokens"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/uid"
	"wanderlust/pkg/utils"

	"github.com/cockroachdb/errors"
	"github.com/inngest/inngestgo"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Service struct {
	*core.Application
	repo    *Repository
	db      *db.Queries
	pool    *pgxpool.Pool
	cache   *cache.Cache
	durable *durable.Durable
}

func (s *Service) getMe(ctx context.Context) (*dto.GetMeOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	user, err := s.repo.get(ctx, userId)

	if err != nil {
		return nil, err
	}

	role, err := s.repo.getRole(ctx, userId)

	if err != nil {
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
			Role:           role,
			CreatedAt:      user.CreatedAt.Time,
			UpdatedAt:      user.UpdatedAt.Time,
		},
	}, nil
}

func (s *Service) login(ctx context.Context, body dto.LoginInputBody) (*dto.LoginOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	user, dbErr := s.repo.getByEmail(ctx, body.Email)

	var hashed = ""

	if dbErr == nil {
		hashed = user.PasswordHash.String
	}

	matched, verifyErr := hash.Verify(body.Password, hashed)

	// If the passwords don't match, or there's an error, return a generic error message.
	if !matched || dbErr != nil || verifyErr != nil {
		return nil, errors.Wrap(ErrLogin, errors.Join(dbErr, verifyErr).Error())
	}

	role, err := s.repo.getRole(ctx, user.ID)

	if err != nil {
		return nil, err
	}

	authTokens, err := tokens.CreateAuthTokens(tokens.UserInformation{
		ID:       user.ID,
		Username: user.Username,
		Role:     role,
	})

	if err != nil {
		return nil, errors.Wrap(ErrFailedToCreateJWT, err.Error())
	}

	err = s.cache.Set(
		ctx,
		cache.KeyBuilder("refresh", authTokens.RefreshTokenJTI),
		authTokens.RefreshToken,
		tokens.RefreshTokenExpiration,
	).Err()

	if err != nil {
		return nil, errors.Wrap(ErrFailedToStoreJWT, err.Error())
	}

	return &dto.LoginOutput{
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
		return nil, errors.Wrap(ErrInvalidRefreshToken, err.Error())
	}

	key := cache.KeyBuilder("refresh", refreshTokenData.ID)

	// Check Redis cache for the refresh token
	// If it's not there, it means the token is invalid or expired.
	_, err = s.cache.Get(ctx, key).Result()

	if err != nil {
		return nil, errors.Wrap(ErrInvalidRefreshToken, err.Error())
	}

	userId := refreshTokenData.UserID
	user, err := s.repo.get(ctx, userId)

	if err != nil {
		return nil, err
	}

	authTokens, err := tokens.CreateAuthTokens(tokens.UserInformation{
		ID:       user.ID,
		Username: user.Username,
		Role:     refreshTokenData.Role,
	})

	if err != nil {
		return nil, errors.Wrap(ErrFailedToCreateJWT, err.Error())
	}

	// Delete previous refresh token from cache
	err = s.cache.Del(ctx, key).Err()

	if err != nil {
		return nil, errors.Wrap(ErrFailedToRemoveJWT, err.Error())
	}

	// Set new refresh token in cache
	key = cache.KeyBuilder("refresh", authTokens.RefreshTokenJTI)
	err = s.cache.Set(ctx, key, authTokens.RefreshToken, tokens.RefreshTokenExpiration).Err()

	if err != nil {
		return nil, errors.Wrap(ErrFailedToStoreJWT, err.Error())
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

	taken, err := s.repo.checkIfEmailOrUsernameIsTaken(ctx, body.Email, body.Username)

	if err != nil {
		return nil, errors.Wrap(ErrHandleTaken, err.Error())
	}

	if taken {
		return nil, ErrHandleTaken
	}

	ok := isValidUsername(body.Username)

	if !ok {
		return nil, ErrUsernameChars
	}

	saved, err := s.createUserFromCredentialsInfo(ctx, body)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToCreate, err.Error())
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

func (s *Service) createUserFromCredentialsInfo(ctx context.Context, dto dto.RegisterInputBody) (*db.User, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	hashed, err := hash.Hash(dto.Password)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToHash, err.Error())
	}

	return s.repo.createUser(ctx, CreateUserParams{
		ID:           uid.Flake(),
		Email:        dto.Email,
		FullName:     dto.FullName,
		Username:     dto.Username,
		PasswordHash: pgtype.Text{String: hashed, Valid: true},
		GoogleID:     pgtype.Text{},
		FbID:         pgtype.Text{},
		ProfileImage: pgtype.Text{},
	})
}

func (s *Service) sendForgotPasswordEmail(ctx context.Context, email string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	user, err := s.repo.getByEmail(ctx, email)

	if err != nil {
		return err
	}

	code, err := random.DigitsString(6)

	if err != nil {
		return errors.Wrap(ErrFailedToGenerateVerificationCode, err.Error())
	}

	key := cache.KeyBuilder("forgot-password", code)
	err = s.cache.Set(ctx, key, user.Email, time.Minute*15).Err()

	if err != nil {
		return errors.Wrap(ErrFailedToStoreVerificationCode, err.Error())
	}

	_, err = (*s.durable.Client).Send(ctx, inngestgo.GenericEvent[durable.SendForgotPasswordEmailPayload]{
		Name: "send-forgot-password-email",
		Data: durable.SendForgotPasswordEmailPayload{
			Email: user.Email,
			Code:  code,
		},
	})

	if err != nil {
		return errors.Wrap(ErrFailedToEnqueueSendForgotPasswordEmailTask, err.Error())
	}

	return nil
}

func (s *Service) resetPassword(ctx context.Context, body dto.ResetPasswordInputBody) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	user, err := s.repo.getByEmail(ctx, body.Email)

	if err != nil {
		return err
	}

	key := cache.KeyBuilder("forgot-password", body.Code)
	cacheVal, err := s.cache.Get(ctx, key).Result()

	if err != nil {
		return errors.Wrap(ErrInvalidOrExpiredVerificationCode, err.Error())
	}

	if cacheVal != user.Email {
		return ErrInvalidOrExpiredVerificationCode
	}

	hashed, err := hash.Hash(body.NewPassword)

	if err != nil {
		return errors.Wrap(ErrFailedToHash, err.Error())
	}

	err = s.repo.updatePassword(ctx, user.ID, hashed)

	if err != nil {
		return err
	}

	err = s.cache.Del(ctx, key).Err()

	if err != nil {
		return errors.Wrap(ErrFailedToDeleteVerificationCode, err.Error())
	}

	return nil
}

func (s *Service) startOAuthFlow(ctx context.Context, provider string) (*dto.OAuthOutput, error) {
	_, sp := tracing.NewSpan(ctx)
	defer sp.End()

	state, url, err := getOAuthStateAndRedirectUrl(provider)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToCreateOAuthState, err.Error())
	}

	c := &http.Cookie{
		Name:     "state",
		Value:    state,
		Path:     "/",
		MaxAge:   int(time.Hour.Seconds()),
		Secure:   cfg.Env.Env != "dev",
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
		return nil, errors.Wrap(ErrFailedToGetOAuthToken, err.Error())
	}

	userInfo, err := fetchUserInfo(ctx, input.Provider, token)

	if err != nil {
		sp.RecordError(err)
		return nil, errors.Wrap(ErrFailedToFetchOAuthUserInfo, err.Error())
	}

	user, err := s.getOrCreateUserFromOAuthUser(ctx, userInfo)

	if err != nil {
		return nil, err
	}

	role, err := s.repo.getRole(ctx, user.ID)

	if err != nil {
		return nil, err
	}

	authTokens, err := tokens.CreateAuthTokens(tokens.UserInformation{
		ID:       user.ID,
		Username: user.Username,
		Role:     role,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, errors.Wrap(ErrFailedToCreateJWT, err.Error())
	}

	key := cache.KeyBuilder("refresh", authTokens.RefreshTokenJTI)
	err = s.cache.Set(ctx, key, authTokens.RefreshToken, tokens.RefreshTokenExpiration).Err()

	if err != nil {
		return nil, errors.Wrap(ErrFailedToStoreJWT, err.Error())
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
		Status: http.StatusTemporaryRedirect,
		Url:    cfg.Env.OAuthRedirect,
	}, nil
}

func (s *Service) getOrCreateUserFromOAuthUser(ctx context.Context, user *oauthUser) (*db.User, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbUser, err := s.repo.getUserBySocialId(ctx, user.provider, user.id)

	if err == nil {
		// User exists, return it
		return dbUser, nil
	}

	isNotFoundErr := errors.Is(err, ErrNotFound)

	// If the error is not a "not found" error, return it
	if !isNotFoundErr {
		return nil, err
	}

	// If there are no rows, either user doesn't exists
	// or they are using another OAuth provider, or they are using
	// credentials login and now they logged in with OAuth.
	// Check if the user registered with the same email address
	// they have in their OAuth profile. If so, merge accounts.
	dbUser, err = s.repo.getByEmail(ctx, user.email)

	if err == nil && dbUser.ID != "" {
		// Merge accounts
		err = s.repo.updateSocialId(ctx, dbUser.ID, user.provider, user.id)

		if err != nil {
			return nil, err
		}

		return dbUser, nil
	}

	// User doesn't exist yet, create user
	saved, err := s.createUserFromOAuthUser(ctx, user)

	if err != nil {
		return nil, err
	}

	return saved, nil
}

func (s *Service) createUserFromOAuthUser(ctx context.Context, oauthUser *oauthUser) (*db.User, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	username, err := generateUsernameFromEmail(ctx, &db.Db{
		Queries: s.db,
		Pool:    s.pool,
	}, oauthUser.email)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToGenerateUsername, err.Error())
	}

	return s.repo.createUserFromOAuthInfo(ctx, oauthUser, username)
}

func (s *Service) changePassword(ctx context.Context, body dto.ChangePasswordInputBody) (*dto.ChangePasswordOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	if body.NewPassword != body.ConfirmPassword {
		return nil, ErrPasswordsDoNotMatch
	}

	userId := ctx.Value("userId").(string)

	user, err := s.repo.get(ctx, userId)

	if err != nil {
		return nil, err
	}

	// Does user have a password?
	// If not, it means user registered with OAuth.
	// Directly let them change their password.
	// Else, check if the password is correct.
	if user.PasswordHash.Valid {
		matched, verifyErr := hash.Verify(body.CurrentPassword, user.PasswordHash.String)

		if !matched || verifyErr != nil {
			return nil, ErrInvalidCurrentPassword
		}
	}

	hashed, err := hash.Hash(body.NewPassword)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToHash, err.Error())
	}

	err = s.repo.updatePassword(ctx, user.ID, hashed)

	if err != nil {
		return nil, err
	}

	role, err := s.repo.getRole(ctx, user.ID)

	if err != nil {
		return nil, err
	}

	authTokens, err := tokens.CreateAuthTokens(tokens.UserInformation{
		ID:       user.ID,
		Username: user.Username,
		Role:     role,
	})

	if err != nil {
		return nil, errors.Wrap(ErrFailedToCreateJWT, err.Error())
	}

	key := cache.KeyBuilder("refresh", authTokens.RefreshTokenJTI)
	err = s.cache.Set(ctx, key, authTokens.RefreshToken, tokens.RefreshTokenExpiration).Err()

	if err != nil {
		return nil, errors.Wrap(ErrFailedToStoreJWT, err.Error())
	}

	return &dto.ChangePasswordOutput{
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
