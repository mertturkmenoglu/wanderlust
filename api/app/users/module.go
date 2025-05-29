package users

import (
	"context"
	"net/http"
	"wanderlust/app/pois"
	"wanderlust/pkg/authz"
	"wanderlust/pkg/core"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/middlewares"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
)

func Register(grp *huma.Group, app *core.Application) {
	grp.UseSimpleModifier(func(op *huma.Operation) {
		op.Tags = []string{"Users"}
	})

	s := Service{
		app:        app,
		poiService: pois.NewService(app),
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
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.updateImage(ctx, input.Type, input.Body)

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
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.getUserProfile(ctx, input.Username)

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
			Path:          "/users/{username}/followers",
			Summary:       "Get User Followers",
			Description:   "Get user followers by username",
			DefaultStatus: http.StatusOK,
		},
		func(ctx context.Context, input *dto.GetUserFollowersInput) (*dto.GetUserFollowersOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.getFollowers(ctx, input.Username)

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
			Path:          "/users/{username}/top",
			Summary:       "Get User Top Point of Interests",
			Description:   "Get user top point of interests by username",
			DefaultStatus: http.StatusOK,
		},
		func(ctx context.Context, input *dto.GetUserTopPoisInput) (*dto.GetUserTopPoisOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.getTopPois(ctx, input.Username)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPatch,
			Path:          "/users/top",
			Summary:       "Update User Top Point of Interests",
			Description:   "Update user top point of interests",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.UpdateUserTopPoisInput) (*dto.UpdateUserTopPoisOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.updateTopPois(ctx, input.Body)

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
			Path:          "/users/{username}/following",
			Summary:       "Get User Following",
			Description:   "Get user following by username",
			DefaultStatus: http.StatusOK,
		},
		func(ctx context.Context, input *dto.GetUserFollowingInput) (*dto.GetUserFollowingOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.getFollowing(ctx, input.Username)

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
			Path:          "/users/{username}/activities",
			Summary:       "Get User Activities",
			Description:   "Get user activities by username",
			DefaultStatus: http.StatusOK,
		},
		func(ctx context.Context, input *dto.GetUserActivitiesInput) (*dto.GetUserActivitiesOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.getActivities(ctx, input.Username)

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
			Path:          "/users/search/following",
			Summary:       "Search User Following",
			Description:   "Search user following by username",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.SearchUserFollowingInput) (*dto.SearchUserFollowingOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.searchFollowing(ctx, input.Username)

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
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.makeVerified(ctx, input.Username)

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
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.changeFollow(ctx, input.Username)

			if err != nil {
				sp.RecordError(err)
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
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.updateProfile(ctx, input.Body)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)
}
