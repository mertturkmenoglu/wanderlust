package auth

import (
	"context"
	"net/http"
	"time"
	"wanderlust/internal/pkg/cfg"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/dto"
	"wanderlust/internal/pkg/hash"
	"wanderlust/internal/pkg/middlewares"
	"wanderlust/internal/pkg/random"
	"wanderlust/internal/pkg/tasks"
	"wanderlust/internal/pkg/tokens"
	"wanderlust/internal/pkg/utils"

	"github.com/danielgtaylor/huma/v2"
)

func Register(grp *huma.Group, app *core.Application) {
	s := Service{
		app: app,
	}

	grp.UseSimpleModifier(func(op *huma.Operation) {
		op.Tags = []string{"Auth"}
	})

	huma.Get(grp, "/auth/me", func(ctx context.Context, input *struct{}) (*dto.GetMeOutput, error) {
		email := ctx.Value("email").(string)
		user, err := s.getUserByEmail(email)

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
	}, func(o *huma.Operation) {
		o.Summary = "Get Current User"
		o.Description = "Get the current user information"
		o.Middlewares = append(o.Middlewares, middlewares.IsAuth(grp.API))
		o.Security = []map[string][]string{
			{"BearerJWT": {}},
		}
	})

	huma.Post(grp, "/auth/credentials/login", func(ctx context.Context, input *dto.LoginInput) (*dto.LoginOutput, error) {
		user, dbErr := s.getUserByEmail(input.Body.Email)
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
	}, func(o *huma.Operation) {
		o.Summary = "Login with Credentials"
		o.Description = "Login with email and password"
		o.DefaultStatus = 200
	})

	huma.Post(grp, "/auth/credentials/register", func(ctx context.Context, input *dto.RegisterInput) (*dto.RegisterOutput, error) {
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
	}, func(o *huma.Operation) {
		o.Summary = "Register with Credentials"
		o.Description = "Register with email and password"
		o.DefaultStatus = 201
	})

	huma.Post(grp, "/auth/verify-email/send", func(ctx context.Context, input *dto.SendVerificationEmailInput) (*struct{}, error) {
		user, err := s.getUserByEmail(input.Body.Email)

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
	}, func(o *huma.Operation) {
		o.Summary = "Send Verification Email"
		o.Description = "Send verification email to the user"
		o.DefaultStatus = http.StatusNoContent
	})

	huma.Get(grp, "/auth/verify-email/verify", func(ctx context.Context, input *struct{}) (*struct{}, error) {
		return nil, huma.Error501NotImplemented("Not implemented")
	}, func(o *huma.Operation) {
		o.Summary = "Verify Email"
		o.Description = "Verify the email of the user"
	})

	huma.Post(grp, "/auth/forgot-password/send", func(ctx context.Context, input *struct{}) (*struct{}, error) {
		return nil, huma.Error501NotImplemented("Not implemented")
	}, func(o *huma.Operation) {
		o.Summary = "Send Forgot Password Email"
		o.Description = "Send forgot password email to the user"
	})

	huma.Post(grp, "/auth/forgot-password/reset", func(ctx context.Context, input *struct{}) (*struct{}, error) {
		return nil, huma.Error501NotImplemented("Not implemented")
	}, func(o *huma.Operation) {
		o.Summary = "Reset Password"
		o.Description = "Reset the password of the user"
	})

	huma.Get(grp, "/auth/{provider}", func(ctx context.Context, input *dto.OAuthInput) (*dto.OAuthOutput, error) {
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
	}, func(o *huma.Operation) {
		o.Summary = "Start OAuth Flow"
		o.Description = "Start the OAuth flow for the given provider"
		o.DefaultStatus = http.StatusTemporaryRedirect
	})

	huma.Get(grp, "/auth/{provider}/callback", func(ctx context.Context, input *dto.OAuthCallbackInput) (*dto.OAuthCallbackOutput, error) {
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
	}, func(o *huma.Operation) {
		o.Summary = "OAuth Callback"
		o.Description = "Callback for the OAuth flow"
	})
}
