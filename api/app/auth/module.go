package auth

import (
	"context"
	"net/http"
	"time"
	"wanderlust/pkg/cfg"
	"wanderlust/pkg/core"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/hash"
	"wanderlust/pkg/middlewares"
	"wanderlust/pkg/random"
	"wanderlust/pkg/tasks"
	"wanderlust/pkg/tokens"
	"wanderlust/pkg/utils"

	"github.com/danielgtaylor/huma/v2"
)

func Register(grp *huma.Group, app *core.Application) {
	s := Service{
		app: app,
	}

	grp.UseSimpleModifier(func(op *huma.Operation) {
		op.Tags = []string{"Auth"}
	})

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/auth/me",
			DefaultStatus: http.StatusOK,
			Summary:       "Get Current User",
			Description:   "Get the current user information",
			OperationID:   "auth-get-me",
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *struct{}) (*dto.GetMeOutput, error) {
			email := ctx.Value("email").(string)
			user, err := s.getUserByEmail(ctx, email)

			if err != nil {
				return nil, huma.Error404NotFound("User not found")
			}

			return &dto.GetMeOutput{
				Body: dto.GetMeOutputBody{
					ID:                    user.ID,
					Email:                 user.Email,
					Username:              user.Username,
					FullName:              user.FullName,
					GoogleID:              utils.TextToStr(user.GoogleID),
					FacebookID:            utils.TextToStr(user.FbID),
					IsEmailVerified:       user.IsEmailVerified,
					IsOnboardingCompleted: user.IsOnboardingCompleted,
					IsActive:              user.IsActive,
					IsBusinessAccount:     user.IsBusinessAccount,
					IsVerified:            user.IsVerified,
					Role:                  user.Role,
					Bio:                   utils.TextToStr(user.Bio),
					Pronouns:              utils.TextToStr(user.Pronouns),
					Website:               utils.TextToStr(user.Website),
					Phone:                 utils.TextToStr(user.Phone),
					ProfileImage:          utils.TextToStr(user.ProfileImage),
					BannerImage:           utils.TextToStr(user.BannerImage),
					FollowersCount:        user.FollowersCount,
					FollowingCount:        user.FollowingCount,
					LastLogin:             user.LastLogin.Time,
					CreatedAt:             user.CreatedAt.Time,
					UpdatedAt:             user.UpdatedAt.Time,
				},
			}, nil
		})

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/auth/credentials/login",
			DefaultStatus: http.StatusOK,
			Summary:       "Login with Credentials",
			Description:   "Login with email and password",
		},
		func(ctx context.Context, input *dto.LoginInput) (*dto.LoginOutput, error) {
			user, dbErr := s.getUserByEmail(ctx, input.Body.Email)
			var hashed = ""

			if dbErr == nil {
				hashed = user.PasswordHash.String
			}

			matched, verifyErr := hash.Verify(input.Body.Password, hashed)

			// If the passwords don't match, or there's an error, return a generic error message.
			if !matched || dbErr != nil || verifyErr != nil {
				return nil, huma.Error400BadRequest("Invalid email or password")
			}

			jwt, err := tokens.Encode(tokens.Payload{
				ID:       user.ID,
				Username: user.Username,
				Email:    user.Email,
				Role:     user.Role,
			}, time.Now().Add(7*24*time.Hour))

			if err != nil {
				return nil, huma.Error500InternalServerError("Failed to create JWT")
			}

			bearerToken := "Bearer " + jwt

			return &dto.LoginOutput{
				Authorization: bearerToken,
				Body: dto.LoginOutputBody{
					Token: bearerToken,
				},
			}, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/auth/credentials/register",
			Summary:       "Register with Credentials",
			Description:   "Register with email and password",
			DefaultStatus: http.StatusCreated,
		},
		func(ctx context.Context, input *dto.RegisterInput) (*dto.RegisterOutput, error) {
			err := s.checkIfEmailOrUsernameIsTaken(input.Body.Email, input.Body.Username)

			if err != nil {
				return nil, huma.Error400BadRequest("Email or username already taken")
			}

			ok := isValidUsername(input.Body.Username)

			if !ok {
				return nil, huma.Error400BadRequest("Username must include only alphanumeric characters or underscore")
			}

			saved, err := s.createUserFromCredentialsInfo(input.Body)

			if err != nil {
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
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/auth/verify-email/send",
			Summary:       "Send Verification Email",
			Description:   "Send verification email to the user",
			DefaultStatus: http.StatusNoContent,
		},
		func(ctx context.Context, input *dto.SendVerificationEmailInput) (*struct{}, error) {
			user, err := s.getUserByEmail(ctx, input.Body.Email)

			if err != nil {
				return nil, huma.Error400BadRequest("Invalid email")
			}

			if user.IsEmailVerified {
				return nil, huma.Error400BadRequest("Email already verified")
			}

			code, err := random.DigitsString(6)

			if err != nil {
				return nil, huma.Error500InternalServerError("Failed to generate verification code")
			}

			key := "verify-email:" + code
			err = s.app.Cache.Set(key, user.Email, time.Minute*15)

			if err != nil {
				return nil, huma.Error500InternalServerError("Failed to set verification code in cache")
			}

			url := s.getEmailVerifyUrl(code)

			_, err = s.app.Tasks.CreateAndEnqueue(tasks.TypeVerifyEmailEmail, tasks.VerifyEmailEmailPayload{
				Email: user.Email,
				Url:   url,
			})

			if err != nil {
				return nil, huma.Error500InternalServerError("Failed to enqueue verification email task")
			}

			return nil, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/auth/verify-email/verify",
			Summary:       "Verify Email",
			Description:   "Verify the email of the user",
			DefaultStatus: http.StatusNoContent,
		},
		func(ctx context.Context, input *dto.VerifyEmailInput) (*struct{}, error) {
			key := "verify-email:" + input.Code

			if !app.Cache.Has(key) {
				return nil, huma.Error400BadRequest("Invalid or expired verification code")
			}

			email, err := app.Cache.Get(key)

			if err != nil {
				return nil, huma.Error500InternalServerError("Failed to get verification code from cache")
			}

			user, err := s.getUserByEmail(ctx, email)

			if err != nil {
				return nil, huma.Error500InternalServerError("Failed to get user by email")
			}

			if user.IsEmailVerified {
				return nil, huma.Error400BadRequest("Email already verified")
			}

			err = s.verifyUserEmail(user.ID)

			if err != nil {
				return nil, huma.Error500InternalServerError("Failed to verify email")
			}

			return nil, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/auth/forgot-password/send",
			Summary:       "Send Forgot Password Email",
			Description:   "Send forgot password email to the user",
			DefaultStatus: http.StatusNoContent,
		},
		func(ctx context.Context, input *dto.SendForgotPasswordEmailInput) (*struct{}, error) {
			user, err := s.getUserByEmail(ctx, input.Body.Email)

			if err != nil {
				return nil, huma.Error400BadRequest("Invalid email")
			}

			code, err := random.DigitsString(6)

			if err != nil {
				return nil, huma.Error500InternalServerError("Failed to generate verification code")
			}

			key := "forgot-password:" + code
			err = s.app.Cache.Set(key, user.Email, time.Minute*15)

			if err != nil {
				return nil, huma.Error500InternalServerError("Failed to set verification code in cache")
			}

			_, err = s.app.Tasks.CreateAndEnqueue(tasks.TypeForgotPasswordEmail, tasks.ForgotPasswordEmailPayload{
				Email: user.Email,
				Code:  code,
			})

			if err != nil {
				return nil, huma.Error500InternalServerError("Failed to enqueue forgot password email task")
			}

			return nil, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/auth/forgot-password/reset",
			Summary:       "Reset Password",
			Description:   "Reset the password of the user",
			DefaultStatus: http.StatusNoContent,
		},
		func(ctx context.Context, input *dto.ResetPasswordInput) (*struct{}, error) {
			user, err := s.getUserByEmail(ctx, input.Body.Email)

			if err != nil {
				return nil, huma.Error400BadRequest("Invalid email")
			}

			key := "forgot-password:" + input.Body.Code
			cacheVal, err := s.app.Cache.Get(key)

			if err != nil {
				return nil, huma.Error400BadRequest("Invalid or expired verification code")
			}

			if cacheVal != user.Email {
				return nil, huma.Error400BadRequest("Invalid or expired verification code")
			}

			err = s.updateUserPassword(user.ID, input.Body.NewPassword)

			if err != nil {
				return nil, huma.Error500InternalServerError("Failed to update password")
			}

			err = s.app.Cache.Del(key)

			if err != nil {
				return nil, huma.Error500InternalServerError("Failed to delete verification code from cache")
			}

			return nil, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/auth/{provider}",
			Summary:       "Start OAuth Flow",
			Description:   "Start the OAuth flow for the given provider",
			DefaultStatus: http.StatusTemporaryRedirect,
		},
		func(ctx context.Context, input *dto.OAuthInput) (*dto.OAuthOutput, error) {
			state, url, err := getOAuthStateAndRedirectUrl(input.Provider)

			if err != nil {
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
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/auth/{provider}/callback",
			Summary:       "OAuth Callback",
			Description:   "Callback for the OAuth flow",
			DefaultStatus: http.StatusTemporaryRedirect,
		},
		func(ctx context.Context, input *dto.OAuthCallbackInput) (*dto.OAuthCallbackOutput, error) {
			token, err := getOAuthToken(getOAuthTokenParams{
				provider:    input.Provider,
				state:       input.QueryState,
				code:        input.Code,
				cookieState: input.CookieState,
			})

			if err != nil {
				return nil, huma.Error500InternalServerError("Failed to get OAuth token", &huma.ErrorDetail{
					Message:  "Failed to get OAuth token",
					Location: "OAuth",
					Value:    err.Error(),
				})
			}

			userInfo, err := fetchUserInfo(input.Provider, token)

			if err != nil {
				return nil, huma.Error500InternalServerError("Failed to fetch user info", &huma.ErrorDetail{
					Message:  "Failed to fetch user info",
					Location: "OAuth",
					Value:    err.Error(),
				})
			}

			_, err = s.getOrCreateUserFromOAuthUser(userInfo)

			if err != nil {
				return nil, huma.Error500InternalServerError("Failed to create user", &huma.ErrorDetail{
					Message:  "Failed to create user",
					Location: "OAuth",
					Value:    err.Error(),
				})
			}

			return &dto.OAuthCallbackOutput{
				SetCookie: http.Cookie{
					Name:    "state",
					Value:   "",
					MaxAge:  -1,
					Path:    "/",
					Expires: time.Unix(0, 0),
				},
				Status: http.StatusTemporaryRedirect,
				Url:    cfg.Get(cfg.API_AUTH_OAUTH_REDIRECT),
			}, nil
		},
	)
}
