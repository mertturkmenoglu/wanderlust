package main

import "context"

func handleAmenities() error {
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

	d := GetDb()

	logger.Trace("creating amenities", logger.Args("list length", len(list)))

	for i, amenity := range list {
		_, err := d.Queries.CreateAmenity(context.Background(), amenity)

		if err != nil {
			logger.Error("failed to create amenity", logger.Args("amenity", amenity, "index", i))
			return err
		}
	}

	return nil
}
