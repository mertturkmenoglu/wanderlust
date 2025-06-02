package handlers

import (
	"context"
	"wanderlust/cmd/fake/utils"
	"wanderlust/pkg/db"

	"github.com/brianvoe/gofakeit/v7"
)

func (f *Fake) HandleFollows(path string) error {
	userIds, err := utils.ReadFile(path)

	if err != nil {
		return err
	}

	f.tryFollowing(userIds)
	f.tryUpdatingUsers(userIds)

	return nil
}

func (f *Fake) tryFollowing(userIds []string) {
	ctx := context.Background()
	successCounter := 0
	failCounter := 0
	batch := make([]db.BatchFollowParams, 0, 100)

	for _, userId := range userIds {
		for range 10 {
			idx := gofakeit.IntRange(0, len(userIds)-1)
			targetUserId := userIds[idx]

			if targetUserId == userId {
				continue
			}

			batch = append(batch, db.BatchFollowParams{
				FollowerID:  userId,
				FollowingID: targetUserId,
			})
		}

		if len(batch) >= 100 {
			_, err := f.db.Queries.BatchFollow(ctx, batch)

			if err != nil {
				failCounter++
			} else {
				successCounter++
			}

			batch = make([]db.BatchFollowParams, 0, 100)
		}
	}

	if len(batch) >= 100 {
		_, err := f.db.Queries.BatchFollow(ctx, batch)

		if err != nil {
			failCounter++
		} else {
			successCounter++
		}
	}
}

func (f *Fake) tryUpdatingUsers(userIds []string) {
	ctx := context.Background()
	tx, err := f.db.Pool.Begin(ctx)

	if err != nil {
		return
	}

	defer tx.Rollback(ctx)

	qtx := f.db.Queries.WithTx(tx)

	for _, userId := range userIds {
		followingCount, err := qtx.GetFollowingCount(ctx, userId)

		if err != nil {
			continue
		}

		followersCount, err := qtx.GetFollowersCount(ctx, userId)

		if err != nil {
			continue
		}

		err = qtx.SetFollowersCount(ctx, db.SetFollowersCountParams{
			ID:             userId,
			FollowersCount: int32(followersCount),
		})

		if err != nil {
			continue
		}

		err = qtx.SetFollowingCount(ctx, db.SetFollowingCountParams{
			ID:             userId,
			FollowingCount: int32(followingCount),
		})

		if err != nil {
			continue
		}
	}

	err = tx.Commit(ctx)

	if err != nil {
		return
	}
}
