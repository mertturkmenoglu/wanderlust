package users

import (
	"context"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/utils"
)

func (r *repository) GetUserProfile(username string) (db.GetUserProfileByUsernameRow, error) {
	return r.di.Db.Queries.GetUserProfileByUsername(context.Background(), username)
}

func (r *repository) makeUserVerified(id string) error {
	return r.di.Db.Queries.MakeUserVerified(context.Background(), id)
}

func (r *repository) updateUserProfile(id string, dto UpdateUserProfileRequestDto) (db.User, error) {
	return r.di.Db.Queries.UpdateUserProfile(context.Background(), db.UpdateUserProfileParams{
		ID:       id,
		FullName: dto.FullName,
		Bio:      utils.NilStrToText(dto.Bio),
		Pronouns: utils.NilStrToText(dto.Pronouns),
		Website:  utils.NilStrToText(dto.Website),
		Phone:    utils.NilStrToText(dto.Phone),
	})
}

func (r *repository) updateProfileImage(userId string, imageUrl string) error {
	return r.di.Db.Queries.UpdateUserProfileImage(context.Background(), db.UpdateUserProfileImageParams{
		ID:           userId,
		ProfileImage: utils.StrToText(imageUrl),
	})
}

func (r *repository) updateBannerImage(userId string, imageUrl string) error {
	return r.di.Db.Queries.UpdateUserBannerImage(context.Background(), db.UpdateUserBannerImageParams{
		ID:          userId,
		BannerImage: utils.StrToText(imageUrl),
	})
}

func (r *repository) isUserFollowing(thisUserId string, otherUserId string) (bool, error) {
	res, err := r.di.Db.Queries.IsUserFollowing(context.Background(), db.IsUserFollowingParams{
		FollowerID:  thisUserId,
		FollowingID: otherUserId,
	})

	if err != nil {
		return false, err
	}

	return res, nil
}

func (r *repository) follow(thisUserId string, otherUserId string) error {
	ctx := context.Background()
	tx, err := r.di.Db.Pool.Begin(ctx)

	if err != nil {
		return err
	}

	defer tx.Rollback(ctx)

	qtx := r.di.Db.Queries.WithTx(tx)

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

func (r *repository) unfollow(thisUserId string, otherUserId string) error {
	ctx := context.Background()
	tx, err := r.di.Db.Pool.Begin(ctx)

	if err != nil {
		return err
	}

	defer tx.Rollback(ctx)

	qtx := r.di.Db.Queries.WithTx(tx)

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

func (r *repository) getUserFollowers(userId string) ([]db.GetUserFollowersRow, error) {
	res, err := r.di.Db.Queries.GetUserFollowers(context.Background(), userId)

	if err != nil {
		return nil, err
	}

	return res, nil
}

func (r *repository) getUserFollowing(userId string) ([]db.GetUserFollowingRow, error) {
	res, err := r.di.Db.Queries.GetUserFollowing(context.Background(), userId)

	if err != nil {
		return nil, err
	}

	return res, nil
}

func (r *repository) searchUserFollowing(userId string, username string) ([]db.SearchUserFollowingRow, error) {
	res, err := r.di.Db.Queries.SearchUserFollowing(context.Background(), db.SearchUserFollowingParams{
		FollowerID: userId,
		Username:   username,
	})

	if err != nil {
		return nil, err
	}

	return res, nil
}
