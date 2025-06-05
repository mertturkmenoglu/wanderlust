package handlers

import (
	"context"
	"slices"
	"sync"
	"wanderlust/pkg/db"
	"wanderlust/pkg/fake/fakeutils"
)

func (f *Fake) HandleFollows(path string) error {
	userIds, err := fakeutils.ReadFile(path)

	if err != nil {
		return err
	}

	err = f.tryFollowing(userIds)

	if err != nil {
		return err
	}

	err = f.tryUpdatingUsers(userIds)

	if err != nil {
		return err
	}

	return nil
}

func (f *Fake) tryFollowing(userIds []string) error {
	var wg sync.WaitGroup

	chunkCount := fakeutils.GetChunkCount(len(userIds), 100)
	errChan := make(chan error, chunkCount)

	for chunk := range slices.Chunk(userIds, 100) {
		wg.Add(1)

		go func(ch []string) {
			defer wg.Done()
			if err := f.followUsers(context.Background(), ch, userIds); err != nil {
				errChan <- err
			}
		}(chunk)
	}

	wg.Wait()
	close(errChan)

	return fakeutils.CombineErrors(errChan)
}

func (f *Fake) followUsers(ctx context.Context, chunk []string, allUserIds []string) error {
	for _, userId := range chunk {
		batch := make([]db.BatchFollowParams, 0, len(chunk))
		targets := fakeutils.RandElems(allUserIds, 10)

		for _, targetUserId := range targets {
			if targetUserId == userId {
				continue
			}

			batch = append(batch, db.BatchFollowParams{
				FollowerID:  userId,
				FollowingID: targetUserId,
			})
		}

		_, err := f.db.Queries.BatchFollow(ctx, batch)

		// Key collisions can happen. Ignore it.
		if err != nil {
			continue
		}
	}

	return nil
}

func (f *Fake) tryUpdatingUsers(userIds []string) error {
	var wg sync.WaitGroup

	chunkCount := fakeutils.GetChunkCount(len(userIds), 100)
	errChan := make(chan error, chunkCount)

	for chunk := range slices.Chunk(userIds, 100) {
		wg.Add(1)

		go func(ch []string) {
			defer wg.Done()
			if err := f.updateUsers(context.Background(), ch); err != nil {
				errChan <- err
			}
		}(chunk)
	}

	wg.Wait()
	close(errChan)

	return fakeutils.CombineErrors(errChan)
}

func (f *Fake) updateUsers(ctx context.Context, ids []string) error {
	tx, err := f.db.Pool.Begin(ctx)

	if err != nil {
		return err
	}

	defer tx.Rollback(ctx)

	qtx := f.db.Queries.WithTx(tx)

	for _, userId := range ids {
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

	return tx.Commit(ctx)
}
