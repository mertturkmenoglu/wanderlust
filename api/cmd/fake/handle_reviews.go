package main

import (
	"bufio"
	"context"
	"os"
	"wanderlust/pkg/db"

	"github.com/brianvoe/gofakeit/v7"
	"github.com/pterm/pterm"
)

func handleReviews() error {
	poiPath, _ := pterm.DefaultInteractiveTextInput.Show("Enter the path to the file that contains POI ids:")
	userPath, _ := pterm.DefaultInteractiveTextInput.Show("enter the path to the file that contains user ids:")

	poiFile, err := os.Open(poiPath)

	if err != nil {
		return err
	}

	defer poiFile.Close()

	userFile, err := os.Open(userPath)

	if err != nil {
		return err
	}

	defer userFile.Close()

	poiScanner := bufio.NewScanner(poiFile)
	userScanner := bufio.NewScanner(userFile)

	userIds := make([]string, 0)

	for userScanner.Scan() {
		id := userScanner.Text()
		userIds = append(userIds, id)
	}

	logger.Trace("Read user ids file", logger.Args("count", len(userIds)))

	if err = userScanner.Err(); err != nil {
		return err
	}

	i := 1

	for poiScanner.Scan() {
		if i%100 == 0 {
			logger.Trace("inserting review", logger.Args("i", i))
		}

		id := poiScanner.Text()
		n := gofakeit.IntRange(25, 100)
		randUserIds := randElems(userIds, 5)
		err = createReviewForPoi(id, n, randUserIds)

		if err != nil {
			return err
		}

		i++
	}

	return poiScanner.Err()
}

func createReviewForPoi(poiId string, count int, userIds []string) error {
	d := GetDb()
	params := make([]db.BatchCreateReviewsParams, 0)

	for i := 0; i < count; i++ {
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

func handleReviewMedia() error {
	path, _ := pterm.DefaultInteractiveTextInput.Show("Enter the path to the file that contains review ids:")
	f, err := os.Open(path)

	if err != nil {
		return err
	}

	defer f.Close()

	scanner := bufio.NewScanner(f)
	i := 1

	for scanner.Scan() {
		if i%100 == 0 {
			logger.Trace("inserting review media", logger.Args("i", i))
		}

		id := scanner.Text()
		n := gofakeit.IntRange(0, 4)
		err = createReviewMedia(id, n)

		if err != nil {
			return err
		}

		i++
	}

	return scanner.Err()
}

func createReviewMedia(id string, n int) error {
	params := make([]db.BatchCreateReviewMediaParams, 0)

	for i := 0; i < n; i++ {
		params = append(params, db.BatchCreateReviewMediaParams{
			ReviewID:   id,
			Url:        getRandomImageUrl(),
			MediaOrder: int16(i + 1),
		})
	}

	_, err := GetDb().Queries.BatchCreateReviewMedia(context.Background(), params)
	return err
}
