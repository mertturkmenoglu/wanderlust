package main

import (
	"context"
	"fmt"
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

	logger.Trace("Read poi ids file", logger.Args("count", len(poiIds)))
	logger.Trace("Read user ids file", logger.Args("count", len(userIds)))

	for i, id := range poiIds {
		if i%100 == 0 {
			logger.Trace("inserting review", logger.Args("i", i))
		}

		n := gofakeit.IntRange(1, 100)
		randUserIds := randElems(userIds, 50)
		err = createReviewForPoi(id, n, randUserIds)

		if err != nil {
			return err
		}
	}

	return nil
}

func createReviewForPoi(poiId string, count int, userIds []string) error {
	d := GetDb()
	params := make([]db.BatchCreateReviewsParams, 0)

	for range count {
		userId := randElem(userIds)
		params = append(params, db.BatchCreateReviewsParams{
			ID:      gofakeit.UUID(),
			PoiID:   poiId,
			UserID:  userId,
			Content: gofakeit.Paragraph(2, 4, 5, " "),
			Rating:  int16(gofakeit.IntRange(1, 5)),
		})
	}

	_, err := d.Queries.BatchCreateReviews(context.Background(), params)

	return err
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

	for i, id := range reviewIds {
		// Not all reviews should have media. 1/3 of them should have media.
		chance := gofakeit.Float32()

		if chance < 0.66 {
			skipped++
			continue
		}

		if i%100 == 0 {
			logger.Trace(
				"inserting review media",
				logger.Args("progress", fmt.Sprintf("(%d/%d)", i, len(reviewIds))),
			)
		}

		n := gofakeit.IntRange(0, 4)
		err = createReviewMedia(id, n)

		if err != nil {
			return err
		}
	}

	logger.Trace("Skipped generating review media for this number of reviews:", logger.Args("count", skipped))

	return nil
}

func createReviewMedia(id string, n int) error {
	params := make([]db.BatchCreateReviewMediaParams, 0)

	for i := range n {
		params = append(params, db.BatchCreateReviewMediaParams{
			ReviewID:   id,
			Url:        getRandomImageUrl(),
			MediaOrder: int16(i + 1),
		})
	}

	_, err := GetDb().Queries.BatchCreateReviewMedia(context.Background(), params)
	return err
}
