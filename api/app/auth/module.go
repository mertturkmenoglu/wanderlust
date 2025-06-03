package auth

import (
	"context"
	"net/http"
	"wanderlust/pkg/core"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/middlewares"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
)

func Register(grp *huma.Group, app *core.Application) {
	s := Service{
		app,
		app.Db.Queries,
		app.Db.Pool,
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
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.getMe(ctx)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
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
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.login(ctx, input.Body)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/auth/logout",
			Summary:       "Logout",
			Description:   "Logout",
			DefaultStatus: http.StatusNoContent,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *struct{}) (*dto.LogoutOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.logout(ctx)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/auth/refresh",
			Summary:       "Refresh Tokens",
			Description:   "Refresh the tokens of the user",
			DefaultStatus: http.StatusNoContent,
		},
		func(ctx context.Context, input *dto.RefreshInput) (*dto.RefreshOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.refresh(ctx, input.CookieRefreshToken)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
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
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.register(ctx, input.Body)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
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
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			err := s.sendForgotPasswordEmail(ctx, input.Body.Email)

			if err != nil {
				sp.RecordError(err)
				return nil, err
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
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			err := s.resetPassword(ctx, input.Body)

			if err != nil {
				sp.RecordError(err)
				return nil, err
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
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.startOAuthFlow(ctx, input.Provider)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil

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
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.oauthCallback(ctx, input)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/auth/password/change",
			DefaultStatus: http.StatusOK,
			Summary:       "Change Password",
			Description:   "Change the password of the user",
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.ChangePasswordInput) (*dto.ChangePasswordOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.changePassword(ctx, input.Body)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)
}
