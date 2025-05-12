package main

import (
	"context"
	"encoding/json"
	"wanderlust/pkg/db"
	"wanderlust/pkg/utils"

	"github.com/brianvoe/gofakeit/v7"
	"github.com/sony/sonyflake"
)

func handlePois(count int) error {
	sf := sonyflake.NewSonyflake(sonyflake.Settings{})
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
			totalVotes := int32(gofakeit.Number(1000, 10_000))

			arg = append(arg, db.BatchCreatePoisParams{
				ID:                 utils.GenerateId(sf),
				Name:               gofakeit.Sentence(3),
				Phone:              utils.StrToText(gofakeit.Phone()),
				Description:        gofakeit.LoremIpsumSentence(32),
				AddressID:          addressId,
				Website:            utils.StrToText(gofakeit.URL()),
				PriceLevel:         int16(gofakeit.Number(1, 5)),
				AccessibilityLevel: int16(gofakeit.Number(1, 5)),
				TotalVotes:         totalVotes,
				TotalPoints:        int32(gofakeit.Number(int(totalVotes), int(totalVotes)*5)),
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

func genRandOpenTimes() ([]byte, error) {
	v := map[string]any{
		"mon": genOpenTimesForDay(),
		"tue": genOpenTimesForDay(),
		"wed": genOpenTimesForDay(),
		"thu": genOpenTimesForDay(),
		"fri": genOpenTimesForDay(),
		"sat": genOpenTimesForDay(),
		"sun": genOpenTimesForDay(),
	}

	return json.Marshal(v)
}

func genOpenTimesForDay() map[string]string {
	openings := []string{
		"11/15/2024, 8:00:00 AM",
		"11/15/2024, 9:00:00 AM",
		"11/15/2024, 9:30:00 AM",
		"11/15/2024, 10:00:00 AM",
		"11/15/2024, 11:00:00 AM",
	}

	closings := []string{
		"11/15/2024, 17:00:00 PM",
		"11/15/2024, 18:00:00 PM",
		"11/15/2024, 19:00:00 PM",
		"11/15/2024, 20:00:00 PM",
		"11/15/2024, 21:00:00 PM",
	}

	return map[string]string{
		"opensAt":  openings[gofakeit.Number(0, len(openings)-1)],
		"closesAt": closings[gofakeit.Number(0, len(closings)-1)],
	}
}
