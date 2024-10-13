package main

import (
	"context"
	"encoding/json"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/utils"

	"github.com/brianvoe/gofakeit/v7"
)

func handlePois(count int) error {
	step := 1000

	if count < step {
		step = count
	}

	ctx := context.Background()
	d := GetDb()

	for i := 0; i < count; i += step {
		if i%step == 0 {
			logger.Trace("Inserting pois", logger.Args("index", i))
		}

		if i+step >= count {
			step = count - i
		}

		arg := make([]db.BatchCreatePoisParams, 0, step)
		addressIds, err := d.Queries.RandSelectAddresses(ctx, int32(step))
		addressIdsLen := len(addressIds)

		if err != nil {
			return err
		}

		for j := range step {
			ot, err := genRandOpenTimes()

			if err != nil {
				return err
			}

			idx := j % addressIdsLen
			addressId := addressIds[idx]

			arg = append(arg, db.BatchCreatePoisParams{
				ID:                 gofakeit.UUID(),
				Name:               gofakeit.Sentence(3),
				Phone:              utils.StrToText(gofakeit.Phone()),
				Description:        gofakeit.LoremIpsumSentence(32),
				AddressID:          addressId,
				Website:            utils.StrToText(gofakeit.URL()),
				PriceLevel:         int16(gofakeit.Number(1, 5)),
				AccessibilityLevel: int16(gofakeit.Number(1, 5)),
				TotalVotes:         int32(gofakeit.Number(1000, 10000)),
				TotalPoints:        int32(gofakeit.Number(1000, 50000)),
				TotalFavorites:     int32(gofakeit.Number(1000, 10000)),
				CategoryID:         int16(gofakeit.Number(1, 23)),
				OpenTimes:          ot,
			})
		}

		_, err = d.Queries.BatchCreatePois(ctx, arg)

		if err != nil {
			return err
		}
	}

	return nil
}

type openTimes struct {
	Day    string  `json:"day"`
	Open   *string `json:"open"`
	Close  *string `json:"close"`
	Closed bool    `json:"closed"`
}

func genRandOpenTimes() ([]byte, error) {
	hours := [7]openTimes{
		genOpenTimesForDay("MON"),
		genOpenTimesForDay("TUE"),
		genOpenTimesForDay("WED"),
		genOpenTimesForDay("THU"),
		genOpenTimesForDay("FRI"),
		genOpenTimesForDay("SAT"),
		genOpenTimesForDay("SUN"),
	}

	v := map[string]any{
		"openhours": hours,
	}

	return json.Marshal(v)
}

func genOpenTimesForDay(day string) openTimes {
	openings := []string{
		"8:00",
		"9:00",
		"9:30",
		"10:00",
		"11:00",
	}

	closings := []string{
		"17:00",
		"18:00",
		"19:00",
		"20:00",
		"21:00",
	}

	closed := gofakeit.Bool()

	if closed {
		return openTimes{
			Day:    day,
			Open:   nil,
			Close:  nil,
			Closed: true,
		}
	}

	return openTimes{
		Day:    day,
		Open:   &openings[gofakeit.Number(0, len(openings)-1)],
		Close:  &closings[gofakeit.Number(0, len(closings)-1)],
		Closed: false,
	}
}
