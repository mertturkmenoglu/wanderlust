package users

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"wanderlust/internal/pkg/activities"
	"wanderlust/internal/pkg/cache"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/dto"
	"wanderlust/internal/pkg/mapper"
	"wanderlust/internal/pkg/upload"
	"wanderlust/internal/pkg/utils"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/minio/minio-go/v7"
)

type Service struct {
	app *core.Application
}

func (s *Service) updateImage(userId string, updateType string, input dto.UpdateUserProfileImageInputBody) (*dto.UpdateUserProfileImageOutput, error) {
	bucket := upload.BUCKET_PROFILE_IMAGES

	if updateType == "banner" {
		bucket = upload.BUCKET_BANNER_IMAGES
	}

	_, err := s.app.Upload.Client.GetObject(
		context.Background(),
		string(bucket),
		input.FileName,
		minio.GetObjectOptions{},
	)

	if err != nil {
		return nil, err
	}

	if !s.app.Cache.Has(cache.KeyBuilder(cache.KeyImageUpload, userId, input.ID)) {
		return nil, huma.Error400BadRequest("Invalid file")
	}

	err = s.app.Cache.Del(cache.KeyBuilder(cache.KeyImageUpload, userId, input.ID))

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to delete cache")
	}

	endpoint := s.app.Upload.Client.EndpointURL().String()
	url := endpoint + "/" + string(bucket) + "/" + input.FileName

	if updateType == "banner" {
		err = s.app.Db.Queries.UpdateUserBannerImage(context.Background(), db.UpdateUserBannerImageParams{
			ID:          userId,
			BannerImage: pgtype.Text{String: url, Valid: true},
		})
	} else {
		err = s.app.Db.Queries.UpdateUserProfileImage(context.Background(), db.UpdateUserProfileImageParams{
			ID:           userId,
			ProfileImage: pgtype.Text{String: url, Valid: true},
		})
	}

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to update profile image")
	}

	return &dto.UpdateUserProfileImageOutput{
		Body: dto.UpdateUserProfileImageOutputBody{
			URL: url,
		},
	}, nil
}

func (s *Service) getUserProfile(userId string, username string) (*dto.GetUserProfileOutput, error) {
	dbProfile, err := s.app.Db.Queries.GetUserProfileByUsername(context.Background(), username)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("user not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get user profile")
	}

	var following = false

	if userId != "" {
		following, err = s.isFollowing(userId, dbProfile.ID)

		if err != nil {
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

func (s *Service) isFollowing(thisId string, otherId string) (bool, error) {
	if thisId == otherId {
		return false, nil
	}

	return s.app.Db.Queries.IsUserFollowing(context.Background(), db.IsUserFollowingParams{
		FollowerID:  thisId,
		FollowingID: otherId,
	})
}

func (s *Service) getFollowers(username string) (*dto.GetUserFollowersOutput, error) {
	dbProfile, err := s.app.Db.Queries.GetUserProfileByUsername(context.Background(), username)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("user not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get user followers")
	}

	res, err := s.app.Db.Queries.GetUserFollowers(context.Background(), dbProfile.ID)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to get user followers")
	}

	return &dto.GetUserFollowersOutput{
		Body: dto.GetUserFollowersOutputBody{
			Followers: mapper.ToFollowers(res),
		},
	}, nil
}

func (s *Service) getFollowing(username string) (*dto.GetUserFollowingOutput, error) {
	dbProfile, err := s.app.Db.Queries.GetUserProfileByUsername(context.Background(), username)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("user not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get user followers")
	}

	res, err := s.app.Db.Queries.GetUserFollowing(context.Background(), dbProfile.ID)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to get user followers")
	}

	return &dto.GetUserFollowingOutput{
		Body: dto.GetUserFollowingOutputBody{
			Following: mapper.ToFollowing(res),
		},
	}, nil
}

func (s *Service) getActivities(username string) (*dto.GetUserActivitiesOutput, error) {
	dbProfile, err := s.app.Db.Queries.GetUserProfileByUsername(context.Background(), username)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("user not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get user activities")
	}

	key := cache.KeyBuilder("activities", dbProfile.ID)

	res, err := s.app.Cache.Client.LRange(context.Background(), key, 0, 100).Result()

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to get user activities")
	}

	out := make([]map[string]any, 0)

	for _, s := range res {
		var tmp map[string]any
		err = json.Unmarshal([]byte(s), &tmp)

		if err != nil {
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

func (s *Service) searchFollowing(userId string, username string) (*dto.SearchUserFollowingOutput, error) {
	res, err := s.app.Db.Queries.SearchUserFollowing(context.Background(), db.SearchUserFollowingParams{
		FollowerID: userId,
		Username:   fmt.Sprintf("%%%s%%", username),
	})

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to search user following")
	}

	return &dto.SearchUserFollowingOutput{
		Body: dto.SearchUserFollowingOutputBody{
			Friends: mapper.FromSearchToFollowing(res),
		},
	}, nil
}

func (s *Service) makeVerified(username string) (*dto.MakeUserVerifiedOutput, error) {
	dbProfile, err := s.app.Db.Queries.GetUserProfileByUsername(context.Background(), username)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("user not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get user profile")
	}

	err = s.app.Db.Queries.MakeUserVerified(context.Background(), dbProfile.ID)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to make user verified")
	}

	return &dto.MakeUserVerifiedOutput{
		Body: dto.MakeUserVerifiedOutputBody{
			IsVerified: true,
		},
	}, nil
}

func (s *Service) changeFollow(thisUserId string, thisUsername string, otherUsername string) (*dto.FollowUserOutput, error) {
	otherUser, err := s.app.Db.Queries.GetUserProfileByUsername(context.Background(), otherUsername)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("user not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get user profile")
	}

	isFollowing, err := s.app.Db.Queries.IsUserFollowing(context.Background(), db.IsUserFollowingParams{
		FollowerID:  thisUserId,
		FollowingID: otherUser.ID,
	})

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to check if user is following")
	}

	if isFollowing {
		err = s.unfollow(thisUserId, otherUser.ID)

		if err != nil {
			return nil, huma.Error500InternalServerError("Failed to unfollow user")
		}
	} else {
		err = s.follow(thisUserId, otherUser.ID)

		if err != nil {
			return nil, huma.Error500InternalServerError("Failed to follow user")
		}
	}

	if !isFollowing {
		_ = s.app.Activities.Add(thisUserId, activities.ActivityFollow, activities.FollowPayload{
			ThisUsername:  thisUsername,
			OtherUsername: otherUsername,
		})
	}

	return &dto.FollowUserOutput{
		Body: dto.FollowUserOutputBody{
			IsFollowing: !isFollowing,
		},
	}, nil
}

func (s *Service) follow(thisUserId string, otherUserId string) error {
	ctx := context.Background()
	tx, err := s.app.Db.Pool.Begin(ctx)

	if err != nil {
		return err
	}

	defer tx.Rollback(ctx)

	qtx := s.app.Db.Queries.WithTx(tx)

	err = qtx.Follow(ctx, db.FollowParams{
		FollowerID:  thisUserId,
		FollowingID: otherUserId,
	})

	if err != nil {
		return err
	}

	err = qtx.IncrUserFollowers(ctx, otherUserId)

	if err != nil {
		return err
	}

	err = qtx.IncrUserFollowing(ctx, thisUserId)

	if err != nil {
		return err
	}

	err = tx.Commit(ctx)

	if err != nil {
		return err
	}

	return nil
}

func (s *Service) unfollow(thisUserId string, otherUserId string) error {
	ctx := context.Background()
	tx, err := s.app.Db.Pool.Begin(ctx)

	if err != nil {
		return err
	}

	defer tx.Rollback(ctx)

	qtx := s.app.Db.Queries.WithTx(tx)

	err = qtx.Unfollow(ctx, db.UnfollowParams{
		FollowerID:  thisUserId,
		FollowingID: otherUserId,
	})

	if err != nil {
		return err
	}

	err = qtx.DecrUserFollowers(ctx, otherUserId)

	if err != nil {
		return err
	}

	err = qtx.DecrUserFollowing(ctx, thisUserId)

	if err != nil {
		return err
	}

	err = tx.Commit(ctx)

	if err != nil {
		return err
	}

	return nil
}

func (s *Service) updateProfile(userId string, body dto.UpdateUserProfileInputBody) (*dto.UpdateUserProfileOutput, error) {
	dbUser, err := s.app.Db.Queries.UpdateUserProfile(context.Background(), db.UpdateUserProfileParams{
		ID:       userId,
		FullName: body.FullName,
		Bio:      utils.NilStrToText(body.Bio),
		Pronouns: utils.NilStrToText(body.Pronouns),
		Website:  utils.NilStrToText(body.Website),
		Phone:    utils.NilStrToText(body.Phone),
	})

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("user not found")
		}

		return nil, huma.Error500InternalServerError("Failed to update user profile")
	}

	return &dto.UpdateUserProfileOutput{
		Body: dto.UpdateUserProfileOutputBody{
			Profile: mapper.FromUserToProfile(dbUser),
		},
	}, nil
}
