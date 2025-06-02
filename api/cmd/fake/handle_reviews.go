package main

import (
	"context"
	"wanderlust/pkg/db"

	"github.com/brianvoe/gofakeit/v7"
)

func handleReviews(poiPath string, userPath string) error {
	isInteractive := poiPath == "" || userPath == ""

	if isInteractive {
		poiPath, _ = input("Enter the path to the file that contains POI ids:")
		userPath, _ = input("enter the path to the file that contains user ids:")
	}

	poiIds, err := readFile(poiPath)

	if err != nil {
		return err
	}

	userIds, err := readFile(userPath)

	if err != nil {
		return err
	}

	logger.Info("Starting review generation for POIs")

	batch := make([]db.BatchCreateReviewsParams, 0)

	for _, id := range poiIds {
		n := gofakeit.IntRange(1, 100)
		randUserIds := randElems(userIds, 50)
		res := createReviewForPoi(id, n, randUserIds)
		batch = append(batch, res...)
	}

	_, err = GetDb().Queries.BatchCreateReviews(context.Background(), batch)

	logger.Info("Ending review generation for POIs")

	return err
}

func createReviewForPoi(poiId string, count int, userIds []string) []db.BatchCreateReviewsParams {
	batch := make([]db.BatchCreateReviewsParams, 0)

	for range count {
		userId := randElem(userIds)
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

func handleReviewMedia(reviewPath string) error {
	isInteractive := reviewPath == ""

	if isInteractive {
		reviewPath, _ = input("Enter the path to the file that contains review ids:")
	}

	reviewIds, err := readFile(reviewPath)

	if err != nil {
		return err
	}

	skipped := 0

	batch := make([]db.BatchCreateReviewImageParams, 0)

	logger.Info("Starting review media generation")

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

	logger.Info("Ending review media generation")

	_, err = GetDb().Queries.BatchCreateReviewImage(context.Background(), batch)

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
