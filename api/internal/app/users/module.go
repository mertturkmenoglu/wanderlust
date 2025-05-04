package users

import (
	"context"
	"net/http"
	"wanderlust/internal/pkg/authz"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/dto"
	"wanderlust/internal/pkg/middlewares"

	"github.com/danielgtaylor/huma/v2"
)

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

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/users/{username}/activities",
			Summary:       "Get User Activities",
			Description:   "Get user activities by username",
			DefaultStatus: http.StatusOK,
		},
		func(ctx context.Context, input *dto.GetUserActivitiesInput) (*dto.GetUserActivitiesOutput, error) {
			res, err := s.getActivities(input.Username)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/users/following/search",
			Summary:       "Search User Following",
			Description:   "Search user following by username",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.SearchUserFollowingInput) (*dto.SearchUserFollowingOutput, error) {
			userId := ctx.Value("userId").(string)
			res, err := s.searchFollowing(userId, input.Username)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/users/{username}/make-verified",
			Summary:       "Make User Verified",
			Description:   "Make user verified by username",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActUserMakeVerified),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.MakeUserVerifiedInput) (*dto.MakeUserVerifiedOutput, error) {
			res, err := s.makeVerified(input.Username)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/users/follow/{username}",
			Summary:       "Follow User",
			Description:   "Follow or unfollow user by username",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.FollowUserInput) (*dto.FollowUserOutput, error) {
			userId := ctx.Value("userId").(string)
			thisUsername := ctx.Value("username").(string)
			res, err := s.changeFollow(userId, thisUsername, input.Username)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPatch,
			Path:          "/users/profile",
			Summary:       "Update User Profile",
			Description:   "Update user profile of the current user",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.UpdateUserProfileInput) (*dto.UpdateUserProfileOutput, error) {
			userId := ctx.Value("userId").(string)
			res, err := s.updateProfile(userId, input.Body)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)
}
