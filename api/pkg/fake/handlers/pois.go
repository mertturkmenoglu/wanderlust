package handlers

import (
	"context"
	"encoding/json"
	"wanderlust/pkg/db"
	"wanderlust/pkg/id"
	"wanderlust/pkg/utils"

	"github.com/brianvoe/gofakeit/v7"
)

type FakePois struct {
	Count int32
	Step  int32
	ID    *id.Generator
	*Fake
}

func (f *FakePois) Generate() (int64, error) {
	if f.Count < f.Step {
		f.Step = f.Count
	}

	var i int32
	for i = 0; i < f.Count; i += f.Step {
		if i+f.Step >= f.Count {
			f.Step = f.Count - i
		}

		batch := make([]db.BatchCreatePoisParams, 0, f.Step)
		addressIds, err := f.db.Queries.RandSelectAddresses(context.Background(), f.Step)

		if err != nil {
			return 0, err
		}

		for j := range f.Step {
			ot, err := genRandOpenTimes()

			if err != nil {
				return 0, err
			}

			addrlen, err := utils.SafeInt64ToInt32(int64(len(addressIds)))

			if err != nil {
				return 0, err
			}

			idx := j % addrlen
			addressId := addressIds[idx]

			price64 := int64(gofakeit.Number(1, 5))
			price, err := utils.SafeInt64ToInt16(price64)

			if err != nil {
				return 0, err
			}

			accessibility64 := int64(gofakeit.Number(1, 5))
			a11y, err := utils.SafeInt64ToInt16(accessibility64)

			if err != nil {
				return 0, err
			}

			category64 := int64(gofakeit.Number(1, 23))
			category, err := utils.SafeInt64ToInt16(category64)

			if err != nil {
				return 0, err
			}

			batch = append(batch, db.BatchCreatePoisParams{
				ID:                 f.ID.Flake(),
				Name:               gofakeit.Sentence(3),
				Phone:              utils.StrToText(gofakeit.Phone()),
				Description:        gofakeit.LoremIpsumSentence(32),
				AddressID:          addressId,
				Website:            utils.StrToText(gofakeit.URL()),
				PriceLevel:         price,
				AccessibilityLevel: a11y,
				TotalVotes:         0,
				TotalPoints:        0,
				TotalFavorites:     0,
				CategoryID:         category,
				Hours:              ot,
			})
		}

		_, err = f.db.Queries.BatchCreatePois(context.Background(), batch)

		if err != nil {
			return 0, err
		}
	}

	return int64(f.Count), nil
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
