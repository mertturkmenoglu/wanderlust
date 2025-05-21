package main

import (
	"bufio"
	"context"
	"os"
	"wanderlust/pkg/db"

	"github.com/brianvoe/gofakeit/v7"
	"github.com/pterm/pterm"
)

func handleFollows() error {
	path, _ := pterm.DefaultInteractiveTextInput.Show("Enter path for the file containin user ids")
	f, err := os.Open(path)

	if err != nil {
		return err
	}

	defer f.Close()

	scanner := bufio.NewScanner(f)

	userIds := make([]string, 0)

	for scanner.Scan() {
		userIds = append(userIds, scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		return err
	}

	logger.Trace("Read user ids", logger.Args("count", len(userIds)))
	logger.Trace("Trying to follow users")

	d := GetDb()
	ctx := context.Background()

	successCounter := 0
	failCounter := 0

	for i, userId := range userIds {
		if i%100 == 0 {
			logger.Trace("Following users", logger.Args("i", i, "success", successCounter, "fail", failCounter))
		}

		for range 20 {
			idx := gofakeit.IntRange(0, len(userIds)-1)
			targetUserId := userIds[idx]

			if targetUserId == userId {
				continue
			}

			err := d.Queries.Follow(ctx, db.FollowParams{
				FollowerID:  userId,
				FollowingID: targetUserId,
			})

			if err != nil {
				failCounter++
			} else {
				successCounter++
			}
		}
	}

	logger.Trace("Followed users", logger.Args("success", successCounter, "key collision fails", failCounter))

	return nil
}
