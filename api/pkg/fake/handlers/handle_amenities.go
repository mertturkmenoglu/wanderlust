package handlers

import "context"

func (f *Fake) HandleAmenities() error {
	list := []string{
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

	for _, amenity := range list {
		_, err := f.db.Queries.CreateAmenity(context.Background(), amenity)

		if err != nil {
			return err
		}
	}

	return nil
}
