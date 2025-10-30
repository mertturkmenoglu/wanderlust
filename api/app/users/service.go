package users

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"wanderlust/app/pois"
	"wanderlust/pkg/activities"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mapper"
	"wanderlust/pkg/storage"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/utils"

	"github.com/cockroachdb/errors"
	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/trace"
	"go.uber.org/zap"
)

type Service struct {
	poiService *pois.Service
	cache      *cache.Cache
	db         *db.Queries
	pool       *pgxpool.Pool
	log        *zap.Logger
	activities *activities.ActivityService
}

func (s *Service) updateImage(ctx context.Context, updateType string, input dto.UpdateUserProfileImageInputBody) (*dto.UpdateUserProfileImageOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	profileBucket, err := storage.OpenBucket(ctx, storage.BUCKET_PROFILE_IMAGES)

	if err != nil {
		return nil, errors.Wrap(huma.Error500InternalServerError("Cannot update picture"), err.Error())
	}

	defer profileBucket.Close()

	bannerBucket, err := storage.OpenBucket(ctx, storage.BUCKET_BANNER_IMAGES)

	if err != nil {
		return nil, errors.Wrap(huma.Error500InternalServerError("Cannot update picture"), err.Error())
	}

	defer bannerBucket.Close()

	var bucket = profileBucket
	var bucketName = storage.BUCKET_PROFILE_IMAGES

	if updateType == "banner" {
		bucket = bannerBucket
		bucketName = storage.BUCKET_BANNER_IMAGES
	}

	exists, err := bucket.Exists(ctx, input.FileName)

	if err != nil {
		return nil, errors.Wrap(huma.Error500InternalServerError("Cannot update picture"), err.Error())
	}

	if !exists {
		return nil, errors.Wrap(huma.Error400BadRequest("File not uploaded"), "user hasn't uploaded file")
	}

	// Check if user uploaded the correct file using cached information
	if !s.cache.Has(ctx, cache.KeyBuilder(cache.KeyImageUpload, input.ID)) {
		err := huma.Error400BadRequest("Incorrect file")
		return nil, errors.Wrap(err, "request data and cache data doesn't match")
	}

	// Delete cached information
	err = s.cache.Del(ctx, cache.KeyBuilder(cache.KeyImageUpload, input.ID)).Err()

	if err != nil {
		return nil, errors.Wrap(huma.Error500InternalServerError("Failed to delete cache"), err.Error())
	}

	url, err := storage.GetUrl(ctx, bucketName, input.FileName)

	if err != nil {
		return nil, errors.Wrap(huma.Error500InternalServerError("Failed to update picture"), err.Error())
	}

	// Get previous profile/banner image information from the database
	userId := ctx.Value("userId").(string)
	dbUser, err := s.db.GetUserById(ctx, userId)

	if err != nil {
		return nil, errors.Wrap(huma.Error500InternalServerError("Failed to get user by id"), err.Error())
	}

	prevBannerImage := utils.TextToStr(dbUser.BannerImage)
	prevProfileImage := utils.TextToStr(dbUser.ProfileImage)

	// Update database
	if updateType == "banner" {
		err = s.db.UpdateUserBannerImage(ctx, db.UpdateUserBannerImageParams{
			ID:          userId,
			BannerImage: pgtype.Text{String: url, Valid: true},
		})
	} else {
		err = s.db.UpdateUserProfileImage(ctx, db.UpdateUserProfileImageParams{
			ID:           userId,
			ProfileImage: pgtype.Text{String: url, Valid: true},
		})
	}

	if err != nil {
		return nil, errors.Wrap(huma.Error500InternalServerError("Failed to update profile image"), err.Error())
	}

	// Delete previous image from S3
	if updateType == "banner" && prevBannerImage != nil {
		objectName := storage.GetFilename(ctx, *prevBannerImage)

		err = bucket.Delete(ctx, objectName)

		if err != nil {
			s.log.Error("Failed to delete previous banner image", zap.String("objectName", objectName), zap.Error(err))
		}
	} else if updateType == "profile" && prevProfileImage != nil {
		objectName := storage.GetFilename(ctx, *prevProfileImage)

		err = bucket.Delete(ctx, objectName)

		if err != nil {
			s.log.Error("Failed to delete previous profile image", zap.String("objectName", objectName), zap.Error(err))
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

	err := s.cache.ReadObj(ctx, cache.KeyBuilder("user-top-pois", username), &cacheRes)

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

	dbProfile, err := s.db.GetUserProfileByUsername(ctx, username)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("User not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get user profile")
	}

	topPois, err := s.db.GetUserTopPois(ctx, dbProfile.ID)

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

	err = s.cache.SetObj(ctx, cache.KeyBuilder("user-top-pois", username), res, cache.TTLUserTopPois)

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

	tx, err := s.pool.Begin(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create transaction")
	}

	defer tx.Rollback(ctx)

	qtx := s.db.WithTx(tx)

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

	err = s.cache.SetObj(ctx, cache.KeyBuilder("user-top-pois", username), pois, cache.TTLUserTopPois)

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

	dbProfile, err := s.db.GetUserProfileByUsername(ctx, username)

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

	return s.db.IsUserFollowing(ctx, db.IsUserFollowingParams{
		FollowerID:  thisId,
		FollowingID: otherId,
	})
}

func (s *Service) getFollowers(ctx context.Context, username string) (*dto.GetUserFollowersOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbProfile, err := s.db.GetUserProfileByUsername(ctx, username)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("User not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get user followers")
	}

	res, err := s.db.GetUserFollowers(ctx, dbProfile.ID)

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

	dbProfile, err := s.db.GetUserProfileByUsername(ctx, username)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("User not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get user followers")
	}

	res, err := s.db.GetUserFollowing(ctx, dbProfile.ID)

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

	dbProfile, err := s.db.GetUserProfileByUsername(ctx, username)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("User not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get user activities")
	}

	key := cache.KeyBuilder("activities", dbProfile.ID)

	res, err := s.cache.LRange(ctx, key, 0, 100).Result()

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

	res, err := s.db.SearchUserFollowing(ctx, db.SearchUserFollowingParams{
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

	dbProfile, err := s.db.GetUserProfileByUsername(ctx, username)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("User not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get user profile")
	}

	err = s.db.MakeUserVerified(ctx, dbProfile.ID)

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

	otherUser, err := s.db.GetUserProfileByUsername(ctx, otherUsername)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("User not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get user profile")
	}

	isFollowing, err := s.db.IsUserFollowing(ctx, db.IsUserFollowingParams{
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
		err = s.activities.Add(ctx, activities.Activity{
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

	tx, err := s.pool.Begin(ctx)

	if err != nil {
		sp.RecordError(err)
		return err
	}

	defer tx.Rollback(ctx)

	qtx := s.db.WithTx(tx)

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

	tx, err := s.pool.Begin(ctx)

	if err != nil {
		sp.RecordError(err)
		return err
	}

	defer tx.Rollback(ctx)

	qtx := s.db.WithTx(tx)

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

	dbUser, err := s.db.UpdateUserProfile(ctx, db.UpdateUserProfileParams{
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
