package main

import (
	"context"
	"wanderlust/pkg/db"

	"github.com/brianvoe/gofakeit/v7"
	"github.com/pterm/pterm"
)

func handleFollows(path string) error {
	isInteractive := path == ""

	if path == "" {
		path, _ = pterm.DefaultInteractiveTextInput.Show("Enter path for the file containin user ids")
	}

	userIds, err := readFile(path)

	if err != nil {
		return err
	}

	logger.Info("Starting following users")

	tryFollowing(userIds)

	logger.Info("Ending following users")

	if isInteractive {
		ans, _ := pterm.DefaultInteractiveTextInput.Show("Inserted to follows table. Do you want to update users table? [Y/n]")

		if ans == "n" || ans == "N" {
			return nil
		}
	}

	logger.Info("Trying to update users table")

	tryUpdatingUsers(userIds)

	logger.Info("Ending updating users table")

	return nil
}

func tryFollowing(userIds []string) {
	d := GetDb()
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
			_, err := d.Queries.BatchFollow(ctx, batch)

			if err != nil {
				failCounter++
			} else {
				successCounter++
			}

			batch = make([]db.BatchFollowParams, 0, 100)
		}
	}

	if len(batch) >= 100 {
		_, err := d.Queries.BatchFollow(ctx, batch)

		if err != nil {
			failCounter++
		} else {
			successCounter++
		}
	}

	logger.Info("Followed users", logger.Args("success", successCounter, "fails", failCounter))
}

func tryUpdatingUsers(userIds []string) {
	d := GetDb()
	ctx := context.Background()
	successCounter := 0
	failCounter := 0

	for _, userId := range userIds {
		followingCount, err := d.Queries.GetFollowingCount(ctx, userId)

		if err != nil {
			failCounter++
			continue
		}

		followersCount, err := d.Queries.GetFollowersCount(ctx, userId)

		if err != nil {
			failCounter++
			continue
		}

		err = d.Queries.SetFollowersCount(ctx, db.SetFollowersCountParams{
			ID:             userId,
			FollowersCount: int32(followersCount),
		})

		if err != nil {
			failCounter++
			continue
		}

		err = d.Queries.SetFollowingCount(ctx, db.SetFollowingCountParams{
			ID:             userId,
			FollowingCount: int32(followingCount),
		})

		if err != nil {
			failCounter++
			continue
		}

		successCounter++
	}
}
