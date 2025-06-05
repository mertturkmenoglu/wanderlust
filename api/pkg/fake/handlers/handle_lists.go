package handlers

import (
	"context"
	"wanderlust/pkg/db"
	"wanderlust/pkg/fake/fakeutils"
	"wanderlust/pkg/id"

	"github.com/brianvoe/gofakeit/v7"
	"github.com/sony/sonyflake"
)

func (f *Fake) HandleLists(usersPath string) error {
	ctx := context.Background()
	idgen := id.NewGenerator(sonyflake.NewSonyflake(sonyflake.Settings{}))

	userIds, err := fakeutils.ReadFile(usersPath)

	if err != nil {
		return err
	}

	batch := make([]db.BatchCreateListsParams, 0)

	for _, userId := range userIds {
		n := gofakeit.Number(1, 10)
		for range n {
			batch = append(batch, db.BatchCreateListsParams{
				ID:       idgen.Flake(),
				Name:     gofakeit.HipsterSentence(4),
				UserID:   userId,
				IsPublic: gofakeit.Bool(),
			})
		}
	}

	_, err = f.db.Queries.BatchCreateLists(ctx, batch)

	return err
}

func (f *Fake) HandleListItems(listsPath string, poisPath string) error {
	ctx := context.Background()
	listIds, err := fakeutils.ReadFile(listsPath)

	if err != nil {
		return err
	}

	poiIds, err := fakeutils.ReadFile(poisPath)

	if err != nil {
		return err
	}

	batch := make([]db.BatchCreateListItemsParams, 0)

	for _, listId := range listIds {
		n := gofakeit.Number(2, 20)
		randPois := fakeutils.RandElems(poiIds, n)

		for i := range n {
			batch = append(batch, db.BatchCreateListItemsParams{
				ListID: listId,
				PoiID:  randPois[i],
				Index:  int32(i + 1),
			})
		}
	}

	_, err = f.db.Queries.BatchCreateListItems(ctx, batch)

	return err
}
