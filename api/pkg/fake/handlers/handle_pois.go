package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"wanderlust/pkg/db"
	"wanderlust/pkg/utils"

	"github.com/brianvoe/gofakeit/v7"
	"github.com/sony/sonyflake"
)

func (f *Fake) HandlePois(count int) error {
	flake := sonyflake.NewSonyflake(sonyflake.Settings{})
	step := 1000
	ctx := context.Background()

	if count < step {
		step = count
	}

	for i := 0; i < count; i += step {
		if i+step >= count {
			step = count - i
		}

		arg := make([]db.BatchCreatePoisParams, 0, step)
		addressIds, err := f.db.Queries.RandSelectAddresses(ctx, int32(step))
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
				TotalVotes:         0,
				TotalPoints:        0,
				TotalFavorites:     0,
				CategoryID:         int16(gofakeit.Number(1, 23)),
				Hours:              ot,
			})
		}

		_, err = f.db.Queries.BatchCreatePois(ctx, arg)

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
