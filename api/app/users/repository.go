package users

import (
	"context"
	"fmt"
	"wanderlust/pkg/db"
	"wanderlust/pkg/tracing"

	"github.com/cockroachdb/errors"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	db   *db.Queries
	pool *pgxpool.Pool
}

func (r *Repository) get(ctx context.Context, id string) (*db.User, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	user, err := r.db.FindUserById(ctx, id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.Wrap(ErrNotFound, err.Error())
		}

		return nil, errors.Wrap(ErrFailedToFetchUser, err.Error())
	}

	return &user, nil
}

func (r *Repository) updateBannerImage(ctx context.Context, id string, url string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	_, err := r.db.UpdateUserBannerImage(ctx, db.UpdateUserBannerImageParams{
		ID: id,
		BannerImage: pgtype.Text{
			String: url,
			Valid:  true,
		},
	})

	if err != nil {
		return errors.Wrap(ErrFailedToUpdateImage, err.Error())
	}

	return nil
}

func (r *Repository) updateProfileImage(ctx context.Context, id string, url string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	_, err := r.db.UpdateUserProfileImage(ctx, db.UpdateUserProfileImageParams{
		ID: id,
		ProfileImage: pgtype.Text{
			String: url,
			Valid:  true,
		},
	})

	if err != nil {
		return errors.Wrap(ErrFailedToUpdateImage, err.Error())
	}

	return nil
}

func (r *Repository) getProfileByUsername(ctx context.Context, username string) (*db.Profile, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	profile, err := r.db.FindProfileByUsername(ctx, username)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.Wrap(ErrNotFound, err.Error())
		}

		return nil, errors.Wrap(ErrFailedToFetchUser, err.Error())
	}

	return &profile, nil
}

func (r *Repository) getTopPlaces(ctx context.Context, username string) ([]db.UserTopPlace, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	profile, err := r.getProfileByUsername(ctx, username)

	if err != nil {
		return nil, err
	}

	places, err := r.db.FindManyUserTopPlaces(ctx, profile.ID)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToListTopPlaces, err.Error())
	}

	return places, nil
}

func (r *Repository) updateTopPlaces(ctx context.Context, userId string, placeIds []string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tx, err := r.pool.Begin(ctx)

	if err != nil {
		return errors.Wrap(ErrFailedToUpdateTopPlaces, err.Error())
	}

	defer tx.Rollback(ctx)

	qtx := r.db.WithTx(tx)

	_, err = qtx.RemoveUserTopPlacesByUserId(ctx, userId)

	if err != nil {
		return errors.Wrap(ErrFailedToUpdateTopPlaces, err.Error())
	}

	for index, placeId := range placeIds {
		_, err = qtx.CreateUserTopPlace(ctx, db.CreateUserTopPlaceParams{
			UserID:  userId,
			PlaceID: placeId,
			Index:   int32(index),
		})

		if err != nil {
			return errors.Wrap(ErrFailedToUpdateTopPlaces, err.Error())
		}
	}

	err = tx.Commit(ctx)

	if err != nil {
		return errors.Wrap(ErrFailedToUpdateTopPlaces, err.Error())
	}

	return nil
}

func (r *Repository) isFollowing(ctx context.Context, thisId string, otherId string) (bool, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	if thisId == otherId {
		return false, nil
	}

	res, err := r.db.IsFollowing(ctx, db.IsFollowingParams{
		FollowerID:  thisId,
		FollowingID: otherId,
	})

	if err != nil {
		return false, errors.Wrap(ErrFailedToCheckFollowing, err.Error())
	}

	return res, nil
}

func (r *Repository) getFollowers(ctx context.Context, username string) ([]db.FindManyFollowersRow, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	profile, err := r.getProfileByUsername(ctx, username)

	if err != nil {
		return nil, err
	}

	res, err := r.db.FindManyFollowers(ctx, profile.ID)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToGetFollowers, err.Error())
	}

	return res, nil
}

func (r *Repository) getFollowing(ctx context.Context, username string) ([]db.FindManyFollowingRow, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	profile, err := r.getProfileByUsername(ctx, username)

	if err != nil {
		return nil, err
	}

	res, err := r.db.FindManyFollowing(ctx, profile.ID)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToGetFollowing, err.Error())
	}

	return res, nil
}

func (r *Repository) searchFollowing(ctx context.Context, userId string, searchUsername string) ([]db.SearchFollowingRow, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.SearchFollowing(ctx, db.SearchFollowingParams{
		FollowerID: userId,
		Username:   fmt.Sprintf("%%%s%%", searchUsername),
	})

	if err != nil {
		return nil, errors.Wrap(ErrFailedToSearchFollowing, err.Error())
	}

	return res, nil
}

func (r *Repository) makeVerified(ctx context.Context, username string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	profile, err := r.getProfileByUsername(ctx, username)

	if err != nil {
		return err
	}

	_, err = r.db.UpdateUserIsVerified(ctx, db.UpdateUserIsVerifiedParams{
		ID:         profile.ID,
		IsVerified: true,
	})

	if err != nil {
		return errors.Wrap(ErrFailedToMakeUserVerified, err.Error())
	}

	return nil
}

func (r *Repository) unfollow(ctx context.Context, thisId string, otherId string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tx, err := r.pool.Begin(ctx)

	if err != nil {
		return errors.Wrap(ErrFailedToFollow, err.Error())
	}

	defer tx.Rollback(ctx)

	qtx := r.db.WithTx(tx)

	_, err = qtx.Unfollow(ctx, db.UnfollowParams{
		FollowerID:  thisId,
		FollowingID: otherId,
	})

	if err != nil {
		return errors.Wrap(ErrFailedToFollow, err.Error())
	}

	_, err = qtx.DecrementUserFollowers(ctx, otherId)

	if err != nil {
		return errors.Wrap(ErrFailedToFollow, err.Error())
	}

	_, err = qtx.DecrementUserFollowing(ctx, thisId)

	if err != nil {
		return errors.Wrap(ErrFailedToFollow, err.Error())
	}

	err = tx.Commit(ctx)

	if err != nil {
		return errors.Wrap(ErrFailedToFollow, err.Error())
	}

	return nil

}

func (r *Repository) follow(ctx context.Context, thisId string, otherId string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tx, err := r.pool.Begin(ctx)

	if err != nil {
		return errors.Wrap(ErrFailedToFollow, err.Error())
	}

	defer tx.Rollback(ctx)

	qtx := r.db.WithTx(tx)

	_, err = qtx.Follow(ctx, db.FollowParams{
		FollowerID:  thisId,
		FollowingID: otherId,
	})

	if err != nil {
		return errors.Wrap(ErrFailedToFollow, err.Error())
	}

	_, err = qtx.IncrementUserFollowers(ctx, otherId)

	if err != nil {
		return errors.Wrap(ErrFailedToFollow, err.Error())
	}

	_, err = qtx.IncrementUserFollowing(ctx, thisId)

	if err != nil {
		return errors.Wrap(ErrFailedToFollow, err.Error())
	}

	err = tx.Commit(ctx)

	if err != nil {
		return errors.Wrap(ErrFailedToFollow, err.Error())
	}

	return nil
}

type UpdateParams = db.UpdateUserProfileParams

func (r *Repository) update(ctx context.Context, params UpdateParams) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tag, err := r.db.UpdateUserProfile(ctx, params)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return errors.Wrap(ErrNotFound, err.Error())
		}

		return errors.Wrap(ErrFailedToUpdate, err.Error())
	}

	if tag.RowsAffected() == 0 {
		return errors.Wrap(ErrNotFound, "no rows affected")
	}

	return nil
}
