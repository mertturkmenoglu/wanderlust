package handlers

import (
	"context"
	"fmt"
	"wanderlust/pkg/db"
	"wanderlust/pkg/fake/fakeutils"
	"wanderlust/pkg/uid"
	"wanderlust/pkg/utils"

	"github.com/brianvoe/gofakeit/v7"
)

type FakePlaces struct {
	Count int32
	Step  int32
	*Fake
}

func (f *FakePlaces) Generate() (int64, error) {
	if f.Count < f.Step {
		f.Step = f.Count
	}

	var i int32
	for i = 0; i < f.Count; i += f.Step {
		if i+f.Step >= f.Count {
			f.Step = f.Count - i
		}

		batch := make([]db.BatchCreatePlacesParams, 0, f.Step)
		addressIds, err := f.db.Queries.FindManyAddressIdsByRand(context.Background(), f.Step)

		if err != nil {
			return 0, err
		}

		for range f.Step {
			hours := genRandOpenTimes()

			if err != nil {
				return 0, err
			}

			batch = append(batch, db.BatchCreatePlacesParams{
				ID:                 uid.Flake(),
				Name:               gofakeit.Sentence(3),
				Phone:              utils.StrToText(gofakeit.Phone()),
				Description:        gofakeit.LoremIpsumSentence(32),
				AddressID:          fakeutils.RandElem(addressIds),
				Website:            utils.StrToText(gofakeit.URL()),
				PriceLevel:         fakeutils.RandInt16Range(1, 5),
				AccessibilityLevel: fakeutils.RandInt16Range(1, 5),
				CategoryID:         fakeutils.RandInt16Range(1, 23),
				Hours:              hours,
			})
		}

		_, err = f.db.Queries.BatchCreatePlaces(context.Background(), batch)

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

func genRandOpenTimes() map[string]*string {
	v := make(map[string]*string)

	for _, d := range days {
		s := genOpenTimesForDay()
		v[d] = &s
	}

	return v
}

func genOpenTimesForDay() string {
	return fmt.Sprintf("%s-%s", openings[gofakeit.Number(0, len(openings)-1)], closings[gofakeit.Number(0, len(closings)-1)])
}
