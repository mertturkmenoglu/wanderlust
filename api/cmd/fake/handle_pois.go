package main

import (
	"context"
	"encoding/json"
	"fmt"
	"wanderlust/pkg/db"
	"wanderlust/pkg/utils"

	"github.com/brianvoe/gofakeit/v7"
	"github.com/sony/sonyflake"
)

func handlePois(count int) error {
	flake := sonyflake.NewSonyflake(sonyflake.Settings{})
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

			idInt, err := flake.NextID()

			if err != nil {
				return err
			}

			id := fmt.Sprintf("%d", idInt)

			arg = append(arg, db.BatchCreatePoisParams{
				ID:                 id,
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
		"07:00",
		"08:00",
		"09:00",
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

	return map[string]string{
		"opensAt":  openings[gofakeit.Number(0, len(openings)-1)],
		"closesAt": closings[gofakeit.Number(0, len(closings)-1)],
	}
}
