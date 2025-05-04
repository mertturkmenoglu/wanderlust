package users

import (
	"context"
	"errors"
	"wanderlust/internal/pkg/cache"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/dto"
	"wanderlust/internal/pkg/mapper"
	"wanderlust/internal/pkg/upload"

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
