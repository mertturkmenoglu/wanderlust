package users

import (
	"context"
	"encoding/json"
	"log/slog"
	"wanderlust/app/places"
	"wanderlust/pkg/activities"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/storage"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/utils"

	"github.com/cockroachdb/errors"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/trace"
	"go.uber.org/zap"
)

type Service struct {
	placesService *places.Service
	cache         *cache.Cache
	log           *zap.Logger
	activities    *activities.ActivityService
	repo          *Repository
}

func (s *Service) updateImage(ctx context.Context, updateType string, input UpdateUserImageInputBody) (*UpdateUserImageOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	profileBucket, err := storage.OpenBucket(ctx, storage.BUCKET_PROFILE_IMAGES)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToUpdateImage, err.Error())
	}

	defer profileBucket.Close()

	bannerBucket, err := storage.OpenBucket(ctx, storage.BUCKET_BANNER_IMAGES)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToUpdateImage, err.Error())
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
		return nil, errors.Wrap(ErrFailedToUpdateImage, err.Error())
	}

	if !exists {
		return nil, errors.Wrap(ErrFileNotUploaded, "user hasn't uploaded file")
	}

	// Check if user uploaded the correct file using cached information
	if !s.cache.Has(ctx, cache.KeyBuilder(cache.KeyImageUpload, input.ID)) {
		return nil, errors.Wrap(ErrIncorrectFile, "request data and cache data doesn't match")
	}

	// Delete cached information
	err = s.cache.Del(ctx, cache.KeyBuilder(cache.KeyImageUpload, input.ID)).Err()

	if err != nil {
		return nil, errors.Wrap(ErrFailedToUpdateImage, err.Error())
	}

	url, err := storage.GetUrl(ctx, bucketName, input.FileName)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToUpdateImage, err.Error())
	}

	// Get previous profile/banner image information from the database
	userId := ctx.Value("userId").(string)

	dbUser, err := s.repo.get(ctx, userId)

	if err != nil {
		return nil, err
	}

	prevBannerImage := utils.TextToStr(dbUser.BannerImage)
	prevProfileImage := utils.TextToStr(dbUser.ProfileImage)

	// Update database
	if updateType == "banner" {
		err = s.repo.updateBannerImage(ctx, userId, url)
	} else {
		err = s.repo.updateProfileImage(ctx, userId, url)
	}

	if err != nil {
		return nil, err
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

	return &UpdateUserImageOutput{
		Body: UpdateUserImageOutputBody{
			URL: url,
		},
	}, nil
}

func (s *Service) getTopPlaces(ctx context.Context, username string) (*GetUserTopPlacesOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	var cacheRes []dto.Place

	err := s.cache.ReadObj(ctx, cache.KeyBuilder("user-top-places", username), &cacheRes)

	if err == nil {
		sp.AddEvent("cache.hit", trace.WithAttributes(
			attribute.String("cache-key", cache.KeyBuilder("user-top-places", username)),
		))

		return &GetUserTopPlacesOutput{
			Body: GetUserTopPlacesOutputBody{
				Places: cacheRes,
			},
		}, nil
	}

	sp.AddEvent("cache.miss", trace.WithAttributes(
		attribute.String("cache-key", cache.KeyBuilder("user-top-places", username)),
	))

	topPlaces, err := s.repo.getTopPlaces(ctx, username)

	if err != nil {
		return nil, err
	}

	ids := make([]string, len(topPlaces))

	for i, v := range topPlaces {
		ids[i] = v.PlaceID
	}

	res, err := s.placesService.FindMany(ctx, ids)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToListTopPlaces, err.Error())
	}

	err = s.cache.SetObj(ctx, cache.KeyBuilder("user-top-places", username), res, cache.TTLUserTopPlaces)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToListTopPlaces, err.Error())
	}

	return &GetUserTopPlacesOutput{
		Body: GetUserTopPlacesOutputBody{
			Places: res,
		},
	}, nil
}

func (s *Service) updateTopPlaces(ctx context.Context, body UpdateUserTopPlacesInputBody) (*UpdateUserTopPlacesOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)
	username := ctx.Value("username").(string)

	// Fetch places to ensure they all exist
	places, err := s.placesService.FindMany(ctx, body.PlaceIds)

	if err != nil {
		return nil, ErrPlaceNotFound
	}

	err = s.repo.updateTopPlaces(ctx, userId, body.PlaceIds)

	if err != nil {
		return nil, err
	}

	err = s.cache.SetObj(ctx, cache.KeyBuilder("user-top-places", username), places, cache.TTLUserTopPlaces)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToUpdateTopPlaces, err.Error())
	}

	return &UpdateUserTopPlacesOutput{
		Body: UpdateUserTopPlacesOutputBody{
			Places: places,
		},
	}, nil
}

func (s *Service) getUserProfile(ctx context.Context, username string) (*GetUserProfileOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	profile, err := s.repo.getProfileByUsername(ctx, username)

	if err != nil {
		return nil, err
	}

	var following = false
	userId := ctx.Value("userId").(string)

	if userId != "" {
		following, err = s.repo.isFollowing(ctx, userId, profile.ID)

		if err != nil {
			return nil, errors.Wrap(ErrFailedToCheckFollowing, err.Error())
		}
	}

	return &GetUserProfileOutput{
		Body: GetUserProfileOutputBody{
			Profile: dto.ToProfile(*profile),
			Meta: GetUserProfileOutputMeta{
				IsFollowing: following,
			},
		},
	}, nil
}

func (s *Service) getFollowers(ctx context.Context, username string) (*GetUserFollowersOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.repo.getFollowers(ctx, username)

	if err != nil {
		return nil, err
	}

	return &GetUserFollowersOutput{
		Body: GetUserFollowersOutputBody{
			Followers: dto.ToFollowers(res),
		},
	}, nil
}

func (s *Service) getFollowing(ctx context.Context, username string) (*GetUserFollowingOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.repo.getFollowing(ctx, username)

	if err != nil {
		return nil, err
	}

	return &GetUserFollowingOutput{
		Body: GetUserFollowingOutputBody{
			Following: dto.ToFollowings(res),
		},
	}, nil
}

func (s *Service) getActivities(ctx context.Context, username string) (*GetUserActivitiesOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	profile, err := s.repo.getProfileByUsername(ctx, username)

	if err != nil {
		return nil, err
	}

	key := cache.KeyBuilder("activities", profile.ID)
	res, err := s.cache.LRange(ctx, key, 0, 100).Result()

	if err != nil {
		return nil, errors.Wrap(ErrFailedToGetActivities, err.Error())
	}

	out := make([]map[string]any, 0)

	for _, s := range res {
		var tmp map[string]any
		err = json.Unmarshal([]byte(s), &tmp)

		if err != nil {
			return nil, errors.Wrap(ErrFailedToGetActivities, err.Error())
		}

		out = append(out, tmp)
	}

	return &GetUserActivitiesOutput{
		Body: GetUserActivitiesOutputBody{
			Activities: out,
		},
	}, nil
}

func (s *Service) searchFollowing(ctx context.Context, username string) (*SearchUserFollowingOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	res, err := s.repo.searchFollowing(ctx, userId, username)

	if err != nil {
		return nil, err
	}

	return &SearchUserFollowingOutput{
		Body: SearchUserFollowingOutputBody{
			Friends: dto.ToFollowingsFromSearch(res),
		},
	}, nil
}

func (s *Service) makeVerified(ctx context.Context, username string) (*MakeUserVerifiedOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	err := s.repo.makeVerified(ctx, username)

	if err != nil {
		return nil, err
	}

	return &MakeUserVerifiedOutput{
		Body: MakeUserVerifiedOutputBody{
			IsVerified: true,
		},
	}, nil
}

func (s *Service) changeFollow(ctx context.Context, otherUsername string) (*FollowUserOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	thisUserId := ctx.Value("userId").(string)
	thisUsername := ctx.Value("username").(string)
	otherUserProfile, err := s.repo.getProfileByUsername(ctx, otherUsername)

	if err != nil {
		return nil, err
	}

	isFollowing, err := s.repo.isFollowing(ctx, thisUserId, otherUserProfile.ID)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToFollow, err.Error())
	}

	if isFollowing {
		err = s.repo.unfollow(ctx, thisUserId, otherUserProfile.ID)

		if err != nil {
			return nil, err
		}
	} else {
		err = s.repo.follow(ctx, thisUserId, otherUserProfile.ID)

		if err != nil {
			return nil, err
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

	return &FollowUserOutput{
		Body: FollowUserOutputBody{
			IsFollowing: !isFollowing,
		},
	}, nil
}

func (s *Service) updateProfile(ctx context.Context, body UpdateUserProfileInputBody) (*UpdateUserProfileOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)
	username := ctx.Value("username").(string)

	err := s.repo.update(ctx, UpdateParams{
		ID:       userId,
		FullName: body.FullName,
		Bio:      utils.NilStrToText(body.Bio),
	})

	if err != nil {
		return nil, err
	}

	profile, err := s.repo.getProfileByUsername(ctx, username)

	if err != nil {
		return nil, err
	}

	return &UpdateUserProfileOutput{
		Body: UpdateUserProfileOutputBody{
			Profile: dto.ToProfile(*profile),
		},
	}, nil
}
