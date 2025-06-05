package handlers

import (
	"context"
	"slices"
	"sync/atomic"
	"wanderlust/pkg/db"
	"wanderlust/pkg/fake/fakeutils"

	"golang.org/x/sync/errgroup"
)

type FakeFollows struct {
	UsersPath string
	*Fake
}

func (f *FakeFollows) Generate() (int64, error) {
	userIds, err := fakeutils.ReadFile(f.UsersPath)

	if err != nil {
		return 0, err
	}

	var total atomic.Int64
	g, gctx := errgroup.WithContext(context.Background())
	g.SetLimit(10)

	for chunk := range slices.Chunk(userIds, 100) {
		g.Go(func() error {
			count, err := f.followUsers(gctx, chunk, userIds)
			total.Add(count)
			return err
		})
	}

	if err := g.Wait(); err != nil {
		return 0, err
	}

	g, gctx = errgroup.WithContext(context.Background())
	g.SetLimit(10)

	for chunk := range slices.Chunk(userIds, 100) {
		g.Go(func() error {
			err := f.updateUsers(gctx, chunk)
			return err
		})
	}

	if err := g.Wait(); err != nil {
		return 0, err
	}

	return total.Load(), nil
}

func (f *FakeFollows) followUsers(ctx context.Context, chunk []string, allUserIds []string) (int64, error) {
	var total int64 = 0

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

		count, err := f.db.Queries.BatchFollow(ctx, batch)

		// Key collisions can happen. Ignore it.
		if err != nil {
			continue
		} else {
			total += count
		}
	}

	return total, nil
}

func (f *FakeFollows) updateUsers(ctx context.Context, ids []string) error {
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
