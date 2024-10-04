package main

import (
	"context"
	"fmt"
	"strconv"
	"wanderlust/internal/db"
	"wanderlust/internal/utils"

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
