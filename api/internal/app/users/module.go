package users

import (
	"context"
	"net/http"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/dto"
	"wanderlust/internal/pkg/middlewares"

	"github.com/danielgtaylor/huma/v2"
)

// routes.GET("/:username/activities", m.handlers.GetUserActivities)
// routes.GET("/following/search", m.handlers.SearchUserFollowing, middlewares.IsAuth)
// routes.POST("/:username/make-verified", m.handlers.MakeUserVerified)
// routes.PATCH("/profile", m.handlers.UpdateUserProfile, middlewares.ParseBody[UpdateUserProfileRequestDto], middlewares.IsAuth)
// routes.POST("/follow/:username", m.handlers.FollowUser, middlewares.IsAuth)

func Register(grp *huma.Group, app *core.Application) {
	grp.UseSimpleModifier(func(op *huma.Operation) {
		op.Tags = []string{"Users"}
	})

	s := Service{
		app: app,
	}

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/users/image/{type}",
			Summary:       "Update User Image",
			Description:   "Update the profile image or the banner image of the user",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.UpdateUserProfileImageInput) (*dto.UpdateUserProfileImageOutput, error) {
			userId := ctx.Value("userId").(string)
			res, err := s.updateImage(userId, input.Type, input.Body)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/users/{username}",
			Summary:       "Get User Profile",
			Description:   "Get a user profile by username",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.WithAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.GetUserProfileInput) (*dto.GetUserProfileOutput, error) {
			userId := ctx.Value("userId").(string)
			res, err := s.getUserProfile(userId, input.Username)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/users/{username}/followers",
			Summary:       "Get User Followers",
			Description:   "Get user followers by username",
			DefaultStatus: http.StatusOK,
		},
		func(ctx context.Context, input *dto.GetUserFollowersInput) (*dto.GetUserFollowersOutput, error) {
			res, err := s.getFollowers(input.Username)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/users/{username}/following",
			Summary:       "Get User Following",
			Description:   "Get user following by username",
			DefaultStatus: http.StatusOK,
		},
		func(ctx context.Context, input *dto.GetUserFollowingInput) (*dto.GetUserFollowingOutput, error) {
			res, err := s.getFollowing(input.Username)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)
}
