package users

import (
	"context"
	"net/http"
	"wanderlust/app/pois"
	"wanderlust/pkg/activities"
	"wanderlust/pkg/authz"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/di"
	"wanderlust/pkg/middlewares"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
	"go.uber.org/zap"
)

func Register(grp *huma.Group, app *core.Application) {
	cacheSvc := app.Get(di.SVC_CACHE).(*cache.Cache)
	dbSvc := app.Get(di.SVC_DB).(*db.Db)
	logSvc := app.Get(di.SVC_LOG).(*zap.Logger)
	activitiesSvc := app.Get(di.SVC_ACTIVITIES).(*activities.ActivityService)

	s := Service{
		poiService: pois.NewService(app),
		cache:      cacheSvc,
		log:        logSvc,
		activities: activitiesSvc,
		repo: &Repository{
			db:   dbSvc.Queries,
			pool: dbSvc.Pool,
		},
	}

	grp.UseSimpleModifier(func(op *huma.Operation) {
		op.Tags = []string{"Users"}
	})

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
		func(ctx context.Context, input *UpdateUserImageInput) (*UpdateUserImageOutput, error) {
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
		func(ctx context.Context, input *GetUserProfileInput) (*GetUserProfileOutput, error) {
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
		func(ctx context.Context, input *GetUserFollowersInput) (*GetUserFollowersOutput, error) {
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
			Summary:       "Get User Top Places",
			Description:   "Get user top places by username",
			DefaultStatus: http.StatusOK,
		},
		func(ctx context.Context, input *GetUserTopPlacesInput) (*GetUserTopPlacesOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.getTopPlaces(ctx, input.Username)

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
			Summary:       "Update User Top Places",
			Description:   "Update user top places",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *UpdateUserTopPlacesInput) (*UpdateUserTopPlacesOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.updateTopPlaces(ctx, input.Body)

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
		func(ctx context.Context, input *GetUserFollowingInput) (*GetUserFollowingOutput, error) {
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
		func(ctx context.Context, input *GetUserActivitiesInput) (*GetUserActivitiesOutput, error) {
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
		func(ctx context.Context, input *SearchUserFollowingInput) (*SearchUserFollowingOutput, error) {
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
		func(ctx context.Context, input *MakeUserVerifiedInput) (*MakeUserVerifiedOutput, error) {
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
		func(ctx context.Context, input *FollowUserInput) (*FollowUserOutput, error) {
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
		func(ctx context.Context, input *UpdateUserProfileInput) (*UpdateUserProfileOutput, error) {
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
