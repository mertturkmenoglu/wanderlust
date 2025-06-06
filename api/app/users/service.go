package users

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"strings"
	"wanderlust/app/pois"
	"wanderlust/pkg/activities"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mapper"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/upload"
	"wanderlust/pkg/utils"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/minio/minio-go/v7"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/trace"
)

type Service struct {
	app        *core.Application
	poiService *pois.Service
}

func (s *Service) updateImage(ctx context.Context, updateType string, input dto.UpdateUserProfileImageInputBody) (*dto.UpdateUserProfileImageOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	bucket := upload.BUCKET_PROFILE_IMAGES

	if updateType == "banner" {
		bucket = upload.BUCKET_BANNER_IMAGES
	}

	ok := s.app.Upload.FileExists(bucket, input.FileName)

	if !ok {
		err := huma.Error400BadRequest("File not uploaded")
		sp.RecordError(err)
		return nil, err
	}

	// Check if user uploaded the correct file using cached information
	if !s.app.Cache.Has(ctx, cache.KeyBuilder(cache.KeyImageUpload, input.ID)) {
		err := huma.Error400BadRequest("Incorrect file")
		sp.RecordError(err)
		return nil, err
	}

	// Delete cached information
	err := s.app.Cache.Del(ctx, cache.KeyBuilder(cache.KeyImageUpload, input.ID)).Err()

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to delete cache")
	}

	url := s.app.Upload.GetUrlForFile(bucket, input.FileName)

	// Get previous profile/banner image information from the database
	userId := ctx.Value("userId").(string)
	dbUser, err := s.app.Db.Queries.GetUserById(ctx, userId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get user by id")
	}

	prevBannerImage := utils.TextToStr(dbUser.BannerImage)
	prevProfileImage := utils.TextToStr(dbUser.ProfileImage)

	// Update database
	if updateType == "banner" {
		err = s.app.Db.Queries.UpdateUserBannerImage(ctx, db.UpdateUserBannerImageParams{
			ID:          userId,
			BannerImage: pgtype.Text{String: url, Valid: true},
		})
	} else {
		err = s.app.Db.Queries.UpdateUserProfileImage(ctx, db.UpdateUserProfileImageParams{
			ID:           userId,
			ProfileImage: pgtype.Text{String: url, Valid: true},
		})
	}

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to update profile image")
	}

	// Delete previous image from S3
	endpoint := s.app.Upload.Client.EndpointURL().String()
	removePrefix := endpoint + "/" + string(bucket) + "/"
	objectName := ""

	if updateType == "banner" && prevBannerImage != nil {
		after, _ := strings.CutPrefix(*prevBannerImage, removePrefix)
		objectName = after

		err = s.app.Upload.Client.RemoveObject(ctx, string(bucket), objectName, minio.RemoveObjectOptions{})

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to delete previous profile image")
		}
	} else if updateType == "profile" && prevProfileImage != nil {
		after, _ := strings.CutPrefix(*prevProfileImage, removePrefix)
		objectName = after

		err = s.app.Upload.Client.RemoveObject(ctx, string(bucket), objectName, minio.RemoveObjectOptions{})

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to delete previous profile image")
		}
	}

	return &dto.UpdateUserProfileImageOutput{
		Body: dto.UpdateUserProfileImageOutputBody{
			URL: url,
		},
	}, nil
}

func (s *Service) getTopPois(ctx context.Context, username string) (*dto.GetUserTopPoisOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	var cacheRes []dto.Poi

	err := s.app.Cache.ReadObj(ctx, cache.KeyBuilder("user-top-pois", username), &cacheRes)

	if err == nil {
		sp.AddEvent("cache.hit", trace.WithAttributes(
			attribute.String("cache-key", cache.KeyBuilder("user-top-pois", username)),
		))

		return &dto.GetUserTopPoisOutput{
			Body: dto.GetUserTopPoisOutputBody{
				Pois: cacheRes,
			},
		}, nil
	}

	sp.AddEvent("cache.miss", trace.WithAttributes(
		attribute.String("cache-key", cache.KeyBuilder("user-top-pois", username)),
	))

	dbProfile, err := s.app.Db.Queries.GetUserProfileByUsername(ctx, username)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("User not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get user profile")
	}

	topPois, err := s.app.Db.Queries.GetUserTopPois(ctx, dbProfile.ID)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get user top pois")
	}

	ids := make([]string, len(topPois))

	for i, v := range topPois {
		ids[i] = v.PoiID
	}

	res, err := s.poiService.FindMany(ctx, ids)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get user top pois")
	}

	err = s.app.Cache.SetObj(ctx, cache.KeyBuilder("user-top-pois", username), res, cache.TTLUserTopPois)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to set user top pois in cache")
	}

	return &dto.GetUserTopPoisOutput{
		Body: dto.GetUserTopPoisOutputBody{
			Pois: res,
		},
	}, nil
}

func (s *Service) updateTopPois(ctx context.Context, body dto.UpdateUserTopPoisInputBody) (*dto.UpdateUserTopPoisOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)
	username := ctx.Value("username").(string)

	pois, err := s.poiService.FindMany(ctx, body.PoiIds)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error404NotFound("Point of interests not found")
	}

	tx, err := s.app.Db.Pool.Begin(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create transaction")
	}

	defer tx.Rollback(ctx)

	qtx := s.app.Db.Queries.WithTx(tx)

	err = qtx.DeleteUserAllTopPois(ctx, userId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to delete user top pois")
	}

	for i, poi := range pois {
		index, err := utils.SafeInt64ToInt32(int64(i))

		if err != nil {
			return nil, huma.Error500InternalServerError("Internal server error")
		}

		_, err = qtx.CreateUserTopPoi(ctx, db.CreateUserTopPoiParams{
			UserID: userId,
			PoiID:  poi.ID,
			Index:  index + 1,
		})

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to create user top poi")
		}
	}

	err = s.app.Cache.SetObj(ctx, cache.KeyBuilder("user-top-pois", username), pois, cache.TTLUserTopPois)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to set user top pois in cache")
	}

	err = tx.Commit(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to commit transaction")
	}

	return &dto.UpdateUserTopPoisOutput{
		Body: dto.UpdateUserTopPoisOutputBody{
			Pois: pois,
		},
	}, nil
}

func (s *Service) getUserProfile(ctx context.Context, username string) (*dto.GetUserProfileOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbProfile, err := s.app.Db.Queries.GetUserProfileByUsername(ctx, username)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("User not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get user profile")
	}

	var following = false
	userId := ctx.Value("userId").(string)

	if userId != "" {
		following, err = s.isFollowing(ctx, userId, dbProfile.ID)

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to check if user is following")
		}
	}

	return &dto.GetUserProfileOutput{
		Body: dto.GetUserProfileOutputBody{
			Profile: mapper.ToProfile(dbProfile),
			Meta: dto.GetUserProfileOutputMeta{
				IsFollowing: following,
			},
		},
	}, nil
}

func (s *Service) isFollowing(ctx context.Context, thisId string, otherId string) (bool, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	if thisId == otherId {
		return false, nil
	}

	return s.app.Db.Queries.IsUserFollowing(ctx, db.IsUserFollowingParams{
		FollowerID:  thisId,
		FollowingID: otherId,
	})
}

func (s *Service) getFollowers(ctx context.Context, username string) (*dto.GetUserFollowersOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbProfile, err := s.app.Db.Queries.GetUserProfileByUsername(ctx, username)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("User not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get user followers")
	}

	res, err := s.app.Db.Queries.GetUserFollowers(ctx, dbProfile.ID)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get user followers")
	}

	return &dto.GetUserFollowersOutput{
		Body: dto.GetUserFollowersOutputBody{
			Followers: mapper.ToFollowers(res),
		},
	}, nil
}

func (s *Service) getFollowing(ctx context.Context, username string) (*dto.GetUserFollowingOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbProfile, err := s.app.Db.Queries.GetUserProfileByUsername(ctx, username)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("User not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get user followers")
	}

	res, err := s.app.Db.Queries.GetUserFollowing(ctx, dbProfile.ID)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get user followers")
	}

	return &dto.GetUserFollowingOutput{
		Body: dto.GetUserFollowingOutputBody{
			Following: mapper.ToFollowings(res),
		},
	}, nil
}

func (s *Service) getActivities(ctx context.Context, username string) (*dto.GetUserActivitiesOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbProfile, err := s.app.Db.Queries.GetUserProfileByUsername(ctx, username)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("User not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get user activities")
	}

	key := cache.KeyBuilder("activities", dbProfile.ID)

	res, err := s.app.Cache.Client.LRange(ctx, key, 0, 100).Result()

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get user activities")
	}

	out := make([]map[string]any, 0)

	for _, s := range res {
		var tmp map[string]any
		err = json.Unmarshal([]byte(s), &tmp)

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to unmarshal activities")
		}

		out = append(out, tmp)
	}

	return &dto.GetUserActivitiesOutput{
		Body: dto.GetUserActivitiesOutputBody{
			Activities: out,
		},
	}, nil
}

func (s *Service) searchFollowing(ctx context.Context, username string) (*dto.SearchUserFollowingOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	res, err := s.app.Db.Queries.SearchUserFollowing(ctx, db.SearchUserFollowingParams{
		FollowerID: userId,
		Username:   fmt.Sprintf("%%%s%%", username),
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to search user following")
	}

	return &dto.SearchUserFollowingOutput{
		Body: dto.SearchUserFollowingOutputBody{
			Friends: mapper.ToFollowingsFromSearch(res),
		},
	}, nil
}

func (s *Service) makeVerified(ctx context.Context, username string) (*dto.MakeUserVerifiedOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbProfile, err := s.app.Db.Queries.GetUserProfileByUsername(ctx, username)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("User not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get user profile")
	}

	err = s.app.Db.Queries.MakeUserVerified(ctx, dbProfile.ID)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to make user verified")
	}

	return &dto.MakeUserVerifiedOutput{
		Body: dto.MakeUserVerifiedOutputBody{
			IsVerified: true,
		},
	}, nil
}

func (s *Service) changeFollow(ctx context.Context, otherUsername string) (*dto.FollowUserOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	thisUserId := ctx.Value("userId").(string)
	thisUsername := ctx.Value("username").(string)

	otherUser, err := s.app.Db.Queries.GetUserProfileByUsername(ctx, otherUsername)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("User not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get user profile")
	}

	isFollowing, err := s.app.Db.Queries.IsUserFollowing(ctx, db.IsUserFollowingParams{
		FollowerID:  thisUserId,
		FollowingID: otherUser.ID,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to check if user is following")
	}

	if isFollowing {
		err = s.unfollow(ctx, thisUserId, otherUser.ID)

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to unfollow user")
		}
	} else {
		err = s.follow(ctx, thisUserId, otherUser.ID)

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to follow user")
		}
	}

	if !isFollowing {
		err = s.app.Activities.Add(ctx, activities.Activity{
			UserID: thisUserId,
			Type:   activities.ActivityFollow,
			Payload: activities.FollowPayload{
				ThisUsername:  thisUsername,
				OtherUsername: otherUsername,
			},
		})

		if err != nil {
			tracing.Slog.Error("Failed to add follow activity", slog.Any("error", err))
		}
	}

	return &dto.FollowUserOutput{
		Body: dto.FollowUserOutputBody{
			IsFollowing: !isFollowing,
		},
	}, nil
}

func (s *Service) follow(ctx context.Context, thisUserId string, otherUserId string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tx, err := s.app.Db.Pool.Begin(ctx)

	if err != nil {
		sp.RecordError(err)
		return err
	}

	defer tx.Rollback(ctx)

	qtx := s.app.Db.Queries.WithTx(tx)

	err = qtx.Follow(ctx, db.FollowParams{
		FollowerID:  thisUserId,
		FollowingID: otherUserId,
	})

	if err != nil {
		sp.RecordError(err)
		return err
	}

	err = qtx.IncrUserFollowers(ctx, otherUserId)

	if err != nil {
		sp.RecordError(err)
		return err
	}

	err = qtx.IncrUserFollowing(ctx, thisUserId)

	if err != nil {
		sp.RecordError(err)
		return err
	}

	err = tx.Commit(ctx)

	if err != nil {
		sp.RecordError(err)
		return err
	}

	return nil
}

func (s *Service) unfollow(ctx context.Context, thisUserId string, otherUserId string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tx, err := s.app.Db.Pool.Begin(ctx)

	if err != nil {
		sp.RecordError(err)
		return err
	}

	defer tx.Rollback(ctx)

	qtx := s.app.Db.Queries.WithTx(tx)

	err = qtx.Unfollow(ctx, db.UnfollowParams{
		FollowerID:  thisUserId,
		FollowingID: otherUserId,
	})

	if err != nil {
		sp.RecordError(err)
		return err
	}

	err = qtx.DecrUserFollowers(ctx, otherUserId)

	if err != nil {
		sp.RecordError(err)
		return err
	}

	err = qtx.DecrUserFollowing(ctx, thisUserId)

	if err != nil {
		sp.RecordError(err)
		return err
	}

	err = tx.Commit(ctx)

	if err != nil {
		sp.RecordError(err)
		return err
	}

	return nil
}

func (s *Service) updateProfile(ctx context.Context, body dto.UpdateUserProfileInputBody) (*dto.UpdateUserProfileOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	dbUser, err := s.app.Db.Queries.UpdateUserProfile(ctx, db.UpdateUserProfileParams{
		ID:       userId,
		FullName: body.FullName,
		Bio:      utils.NilStrToText(body.Bio),
		Pronouns: utils.NilStrToText(body.Pronouns),
		Website:  utils.NilStrToText(body.Website),
	})

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("User not found")
		}

		return nil, huma.Error500InternalServerError("Failed to update user profile")
	}

	return &dto.UpdateUserProfileOutput{
		Body: dto.UpdateUserProfileOutputBody{
			Profile: mapper.ToProfileFromUser(dbUser),
		},
	}, nil
}
