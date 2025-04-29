package auth

import (
	"context"

	"github.com/danielgtaylor/huma/v2"
)

func Register(grp *huma.Group) {
	grp.UseSimpleModifier(func(op *huma.Operation) {
		op.Tags = []string{"Auth"}
	})

	grp.UseModifier(huma.PrefixModifier([]string{"/auth"}))

	huma.Get(grp, "/me", func(ctx context.Context, input *struct{}) (*struct{}, error) {
		return nil, nil
	}, func(o *huma.Operation) {
		o.Summary = "Get Current User"
		o.Description = "Get the current user information"
		//IsAuth
	})

	huma.Post(grp, "/logout", func(ctx context.Context, input *struct{}) (*struct{}, error) {
		return nil, nil
	}, func(o *huma.Operation) {
		o.Summary = "Logout"
		o.Description = "Logout the current user"
	})

	huma.Post(grp, "/credentials/login", func(ctx context.Context, input *struct{}) (*struct{}, error) {
		return nil, nil
	}, func(o *huma.Operation) {
		o.Summary = "Login with Credentials"
		o.Description = "Login with email and password"
	})

	huma.Post(grp, "/credentials/register", func(ctx context.Context, input *struct{}) (*struct{}, error) {
		return nil, nil
	}, func(o *huma.Operation) {
		o.Summary = "Register with Credentials"
		o.Description = "Register with email and password"
	})

	huma.Post(grp, "/verify-email/send", func(ctx context.Context, input *struct{}) (*struct{}, error) {
		return nil, nil
	}, func(o *huma.Operation) {
		o.Summary = "Send Verification Email"
		o.Description = "Send verification email to the user"
	})

	huma.Get(grp, "/verify-email/verify", func(ctx context.Context, input *struct{}) (*struct{}, error) {
		return nil, nil
	}, func(o *huma.Operation) {
		o.Summary = "Verify Email"
		o.Description = "Verify the email of the user"
	})

	huma.Post(grp, "/forgot-password/send", func(ctx context.Context, input *struct{}) (*struct{}, error) {
		return nil, nil
	}, func(o *huma.Operation) {
		o.Summary = "Send Forgot Password Email"
		o.Description = "Send forgot password email to the user"
	})

	huma.Post(grp, "/forgot-password/reset", func(ctx context.Context, input *struct{}) (*struct{}, error) {
		return nil, nil
	}, func(o *huma.Operation) {
		o.Summary = "Reset Password"
		o.Description = "Reset the password of the user"
	})

	huma.Get(grp, "/{provider}", func(ctx context.Context, input *struct {
		Provider string `path:"provider" enum:"google,facebook" example:"google" doc:"The OAuth provider"`
	}) (*struct{}, error) {
		return nil, nil
	}, func(o *huma.Operation) {
		o.Summary = "Start OAuth Flow"
		o.Description = "Start the OAuth flow for the given provider"
	})

	huma.Get(grp, "/{provider}/callback", func(ctx context.Context, input *struct {
		Provider string `path:"provider" enum:"google,facebook" example:"google" doc:"The OAuth provider"`
	}) (*struct{}, error) {
		return nil, nil
	}, func(o *huma.Operation) {
		o.Summary = "OAuth Callback"
		o.Description = "Callback for the OAuth flow"
	})
}
