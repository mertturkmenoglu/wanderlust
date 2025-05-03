package main

import (
	"bufio"
	"context"
	"fmt"
	"os"
	"strconv"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/utils"

	"github.com/brianvoe/gofakeit/v7"
	"github.com/pterm/pterm"
)

func getRandomImageUrl() string {
	return fmt.Sprintf("https://loremflickr.com/960/720?lock=%d", gofakeit.IntRange(1, 10_000))
}

func handleMedia() error {
	poiId, _ := pterm.DefaultInteractiveTextInput.Show("Enter poi id")
	sCount, _ := pterm.DefaultInteractiveTextInput.Show("Enter count (2, 10)")

	count, err := strconv.Atoi(sCount)

	if err != nil {
		return err
	}

	return createMediaForPoi(poiId, count)
}

func handleMediaForManyPois() error {
	path, _ := pterm.DefaultInteractiveTextInput.Show("Enter path for the file containin POI ids")
	f, err := os.Open(path)

	if err != nil {
		return err
	}

	defer f.Close()

	scanner := bufio.NewScanner(f)
	i := 1

	for scanner.Scan() {
		if i%100 == 0 {
			logger.Trace("inserting poi media", logger.Args("i", i))
		}

		id := scanner.Text()
		n := gofakeit.IntRange(2, 10)
		err := createMediaForPoi(id, n)

		if err != nil {
			return err
		}

		i++
	}

	return scanner.Err()
}

func createMediaForPoi(poiId string, count int) error {
	for i := 0; i < count; i++ {
		url := getRandomImageUrl()

		_, err := GetDb().Queries.CreatePoiMedia(context.Background(), db.CreatePoiMediaParams{
			PoiID:      poiId,
			Url:        url,
			Alt:        "Alt text for image " + strconv.Itoa(i),
			Caption:    utils.StrToText("Caption text for image " + strconv.Itoa(i)),
			MediaOrder: int16(i + 1),
		})

		if err != nil {
			return err
		}
	}

	return nil
}
