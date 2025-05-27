package main

import (
	"bufio"
	"context"
	"os"
	"wanderlust/pkg/db"

	"github.com/brianvoe/gofakeit/v7"
	"github.com/pterm/pterm"
)

func handleFollows(path string) error {
	isInteractive := path == ""

	if path == "" {
		path, _ = pterm.DefaultInteractiveTextInput.Show("Enter path for the file containin user ids")
	}

	userIds, err := readUserIdsFromFile(path)

	if err != nil {
		return err
	}

	logger.Trace("Read user ids", logger.Args("count", len(userIds)))
	logger.Trace("Trying to follow users")

	tryFollowing(userIds)

	if isInteractive {
		ans, _ := pterm.DefaultInteractiveTextInput.Show("Inserted to follows table. Do you want to update users table? [Y/n]")

		if ans == "n" || ans == "N" {
			return nil
		}
	}

	logger.Trace("Updating users table")

	tryUpdatingUsers(userIds)

	return nil
}

func readUserIdsFromFile(path string) ([]string, error) {
	f, err := os.Open(path)

	if err != nil {
		return nil, err
	}

	defer f.Close()

	scanner := bufio.NewScanner(f)

	userIds := make([]string, 0)

	for scanner.Scan() {
		userIds = append(userIds, scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		return nil, err
	}

	return userIds, nil
}

func tryFollowing(userIds []string) {
	d := GetDb()
	ctx := context.Background()
	successCounter := 0
	failCounter := 0
	batch := make([]db.BatchFollowParams, 0, 100)

	for i, userId := range userIds {
		if i%1000 == 0 {
			logger.Trace("Following users", logger.Args("i", i, "success", successCounter, "fail", failCounter))
		}

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

	logger.Trace("Followed users", logger.Args("success", successCounter, "fails", failCounter))
}

func tryUpdatingUsers(userIds []string) {
	d := GetDb()
	ctx := context.Background()
	successCounter := 0
	failCounter := 0

	for i, userId := range userIds {
		if i%1000 == 0 {
			logger.Trace("Updating users", logger.Args("i", i, "success", successCounter, "fail", failCounter))
		}

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

	logger.Trace("Updated users", logger.Args("success", successCounter, "fails", failCounter))
}
