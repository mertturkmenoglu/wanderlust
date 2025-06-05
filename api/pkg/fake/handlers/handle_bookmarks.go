package handlers

import (
	"context"
	"wanderlust/pkg/db"
	"wanderlust/pkg/fake/fakeutils"

	"github.com/brianvoe/gofakeit/v7"
)

func (f *Fake) HandleBookmarks(usersPath string, poisPath string) error {
	ctx := context.Background()
	userIds, err := fakeutils.ReadFile(usersPath)

	if err != nil {
		return err
	}

	poiIds, err := fakeutils.ReadFile(poisPath)

	if err != nil {
		return err
	}

	batch := make([]db.BatchCreateBookmarksParams, 0)

	for _, userId := range userIds {
		n := gofakeit.Number(10, 20)
		randPois := fakeutils.RandElems(poiIds, n)

		for i := range n {
			batch = append(batch, db.BatchCreateBookmarksParams{
				UserID: userId,
				PoiID:  randPois[i],
			})
		}
	}

	_, err = f.db.Queries.BatchCreateBookmarks(ctx, batch)

	return err
}
