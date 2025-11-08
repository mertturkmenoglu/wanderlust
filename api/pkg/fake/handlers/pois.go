package handlers

import (
	"context"
	"fmt"
	"wanderlust/pkg/db"
	"wanderlust/pkg/fake/fakeutils"
	"wanderlust/pkg/uid"
	"wanderlust/pkg/utils"

	"github.com/brianvoe/gofakeit/v7"
	"github.com/jackc/pgx/v5/pgtype"
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

	ctx := context.Background()

	var i int32
	for i = 0; i < f.Count; i += f.Step {
		if i+f.Step >= f.Count {
			f.Step = f.Count - i
		}

		addressIds, err := f.db.Queries.FindManyAddressIdsByRand(ctx, f.Step)

		if err != nil {
			return 0, err
		}

		tx, err := f.db.Pool.Begin(ctx)

		if err != nil {
			return 0, err
		}

		defer tx.Rollback(ctx)

		qtx := f.db.Queries.WithTx(tx)

		for range f.Step {
			hours := genRandHours()
			amenities := genRandAmenities()

			params := db.CreatePlaceParams{
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
				Amenities:          amenities,
				TotalVotes:         0,
				TotalPoints:        0,
				TotalFavorites:     0,
			}

			_, err = qtx.CreatePlace(context.Background(), params)

			if err != nil {
				return 0, err
			}
		}

		err = tx.Commit(ctx)

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

func genRandHours() pgtype.Hstore {
	hours := pgtype.Hstore{}

	for _, d := range days {
		str := fmt.Sprintf("%s-%s", openings[gofakeit.Number(0, len(openings)-1)], closings[gofakeit.Number(0, len(closings)-1)])
		hours[d] = &str
	}

	return hours
}

var amenities = map[string]string{
	"wifi":                  "Wi-Fi",
	"freeParking":           "Free Parking",
	"paidParking":           "Paid Parking",
	"wheelchair":            "Wheelchair Access",
	"restrooms":             "Restrooms",
	"ac":                    "AC",
	"outdoor":               "Outdoor Seating",
	"indoor":                "Indoor Seating",
	"bar":                   "Bar Area",
	"pet":                   "Pet friendly",
	"kidsPlay":              "Kids' Play Area",
	"driveThru":             "Drive-Thru",
	"loyalty":               "Loyalty Program",
	"allWeekService":        "24/7 Service",
	"delivery":              "Delivery Service",
	"vegan":                 "Vegan",
	"liveMusic":             "Live Music",
	"privateRooms":          "Private Rooms",
	"onlineOrdering":        "Online Ordering",
	"evCharging":            "EV Charging",
	"selfService":           "Self-Service",
	"smoking":               "Smoking",
	"guidedTours":           "Guided Tours",
	"giftShop":              "Gift Shop",
	"snackBar":              "Snack Bar",
	"informationDesk":       "Information Desk",
	"specialExhibitions":    "Special Exhibitions",
	"observationDecks":      "Observation Decks",
	"atm":                   "ATM",
	"photographyArea":       "Photography Area",
	"a11yServices":          "A11Y Services",
	"studyRoom":             "Study Room",
	"romanticAtmosphere":    "Romantic Atmosphere",
	"familyFriendly":        "Family-Friendly",
	"concierge":             "Concierge Services",
	"fitness":               "Fitness Facilities",
	"spa":                   "Spa Services",
	"workspaces":            "Workspaces",
	"groupActivities":       "Group Activities",
	"ecoFriendly":           "Eco Friendly",
	"publicTransportation":  "Public Transportation Access",
	"garden":                "Garden",
	"complimentaryTasting":  "Complimentary Tasting",
	"gamingStations":        "Gaming Stations",
	"onlineReservation":     "Online Reservation",
	"valetParking":          "Valet Parking",
	"catering":              "Catering Services",
	"specialDietaryOptions": "Special Dietary Options",
	"childrensMenu":         "Children's Menu",
	"wineList":              "Wine List",
	"liveCookingStations":   "Live Cooking Stations",
	"happyHourSpecials":     "Happy Hour Specials",
	"chefsSpecials":         "Chef's Specials",
	"communalTables":        "Communal Tables",
	"brunchOptions":         "Brunch Options",
	"eventHosting":          "Event Hosting",
}

func genRandAmenities() pgtype.Hstore {
	amenitiesStore := pgtype.Hstore{}

	for key := range amenities {
		if gofakeit.Bool() {
			amenitiesStore[key] = utils.StrPtr(amenities[key])
		}
	}

	return amenitiesStore
}
