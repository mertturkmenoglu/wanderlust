package handlers

import "context"

var amenitiesData = [...]string{
	"Wi-Fi",
	"Free Parking",
	"Paid Parking",
	"Wheelchair Access",
	"Restrooms",
	"AC",
	"Outdoor Seating",
	"Indoor Seating",
	"Bar Area",
	"Pet friendly",
	"Kids' Play Area",
	"Drive-Thru",
	"Loyalty Program",
	"24/7 Service",
	"Delivery Service",
	"Vegan",
	"Live Music",
	"Private Rooms",
	"Online Ordering",
	"EV Charging",
	"Self-Service",
	"Smoking",
	"Guided Tours",
	"Gift Shop",
	"Snack Bar",
	"Information Desk",
	"Special Exhibitions",
	"Observation Decks",
	"ATM",
	"Photography Area",
	"A11Y Services",
	"Study Room",
	"Romantic Atmosphere",
	"Family-Friendly",
	"Concierge Services",
	"Fitness Facilities",
	"Spa Services",
	"Workspaces",
	"Group Activities",
	"Eco Friendly",
	"Public Transportation Access",
	"Garden",
	"Complimentary Tasting",
	"Gaming Stations",
	"Online Reservation",
	"Valet Parking",
	"Catering Services",
	"Special Dietary Options",
	"Children's Menu",
	"Wine List",
	"Live Cooking Stations",
	"Happy Hour Specials",
	"Chef's Specials",
	"Communal Tables",
	"Brunch Options",
	"Event Hosting",
}

type FakeAmenities struct {
	*Fake
}

func (f *FakeAmenities) Generate() (int64, error) {
	for _, amenity := range amenitiesData {
		if _, err := f.db.Queries.CreateAmenity(context.Background(), amenity); err != nil {
			return 0, err
		}
	}

	return int64(len(amenitiesData)), nil
}
