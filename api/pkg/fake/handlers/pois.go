package handlers

import (
	"context"
	"encoding/json"
	"wanderlust/pkg/db"
	"wanderlust/pkg/fake/fakeutils"
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

		for range f.Step {
			ot, err := genRandOpenTimes()

			if err != nil {
				return 0, err
			}

			batch = append(batch, db.BatchCreatePoisParams{
				ID:                 f.ID.Flake(),
				Name:               gofakeit.Sentence(3),
				Phone:              utils.StrToText(gofakeit.Phone()),
				Description:        gofakeit.LoremIpsumSentence(32),
				AddressID:          fakeutils.RandElem(addressIds),
				Website:            utils.StrToText(gofakeit.URL()),
				PriceLevel:         fakeutils.RandInt16Range(1, 5),
				AccessibilityLevel: fakeutils.RandInt16Range(1, 5),
				TotalVotes:         0,
				TotalPoints:        0,
				TotalFavorites:     0,
				CategoryID:         fakeutils.RandInt16Range(1, 23),
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

var days = [...]string{"mon", "tue", "wed", "thu", "fri", "sat", "sun"}

var openings = [...]string{
	"07:00",
	"08:00",
	"09:00",
	"10:00",
	"11:00",
}

var closings = [...]string{
	"17:00",
	"18:00",
	"19:00",
	"20:00",
	"21:00",
}

func genRandOpenTimes() ([]byte, error) {
	v := make(map[string]any)

	for _, d := range days {
		v[d] = genOpenTimesForDay()
	}

	return json.Marshal(v)
}

func genOpenTimesForDay() map[string]string {

	return map[string]string{
		"opensAt":  openings[gofakeit.Number(0, len(openings)-1)],
		"closesAt": closings[gofakeit.Number(0, len(closings)-1)],
	}
}
