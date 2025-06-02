package handlers

import (
	"context"
	"wanderlust/pkg/db"
	"wanderlust/pkg/fake/fakeutils"

	"github.com/brianvoe/gofakeit/v7"
)

func (f *Fake) HandleReviews(poiPath string, userPath string) error {
	poiIds, err := fakeutils.ReadFile(poiPath)

	if err != nil {
		return err
	}

	userIds, err := fakeutils.ReadFile(userPath)

	if err != nil {
		return err
	}

	batch := make([]db.BatchCreateReviewsParams, 0)

	for _, id := range poiIds {
		n := gofakeit.IntRange(1, 100)
		randUserIds := fakeutils.RandElems(userIds, 50)
		res := createReviewForPoi(id, n, randUserIds)
		batch = append(batch, res...)
	}

	i := 0

	for i = 0; i < len(batch); i += 500 {
		_, err = f.db.Queries.BatchCreateReviews(context.Background(), batch[i:i+100])

		if err != nil {
			return err
		}
	}

	if i < len(batch) {
		_, err = f.db.Queries.BatchCreateReviews(context.Background(), batch[i:])
		return err
	}

	return nil
}

func createReviewForPoi(poiId string, count int, userIds []string) []db.BatchCreateReviewsParams {
	batch := make([]db.BatchCreateReviewsParams, 0)

	for range count {
		userId := fakeutils.RandElem(userIds)
		batch = append(batch, db.BatchCreateReviewsParams{
			ID:      gofakeit.UUID(),
			PoiID:   poiId,
			UserID:  userId,
			Content: gofakeit.Paragraph(2, 4, 5, " "),
			Rating:  int16(gofakeit.IntRange(1, 5)),
		})
	}

	return batch
}

func (f *Fake) HandleReviewMedia(reviewPath string) error {
	reviewIds, err := fakeutils.ReadFile(reviewPath)

	if err != nil {
		return err
	}

	skipped := 0
	batch := make([]db.BatchCreateReviewImageParams, 0)

	for _, id := range reviewIds {
		// Not all reviews should have media. 1/3 of them should have media.
		chance := gofakeit.Float32()

		if chance < 0.66 {
			skipped++
			continue
		}

		n := gofakeit.IntRange(0, 4)
		res := createReviewImages(id, n)
		batch = append(batch, res...)
	}

	_, err = f.db.Queries.BatchCreateReviewImage(context.Background(), batch)
	return err
}

func createReviewImages(id string, n int) []db.BatchCreateReviewImageParams {
	params := make([]db.BatchCreateReviewImageParams, 0)

	for i := range n {
		params = append(params, db.BatchCreateReviewImageParams{
			ReviewID: id,
			Url:      getRandomImageUrl(),
			Index:    int16(i + 1),
		})
	}

	return params
}
