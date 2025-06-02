package mapper

import (
	"encoding/json"
	"fmt"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
)

func ToTripVisibilityLevel(lvl string) dto.TripVisibilityLevel {
	switch lvl {
	case "public":
		return dto.TRIP_VISIBILITY_LEVEL_PUBLIC
	case "friends":
		return dto.TRIP_VISIBILITY_LEVEL_FRIENDS
	case "private":
		return dto.TRIP_VISIBILITY_LEVEL_PRIVATE
	default:
		return dto.TRIP_VISIBILITY_LEVEL_PRIVATE
	}
}

func ToTrip(dbTrip db.GetTripsByIdsPopulatedRow) (dto.Trip, error) {
	var owner dto.TripUser

	err := json.Unmarshal(dbTrip.Owner, &owner)

	if err != nil {
		return dto.Trip{}, err
	}

	participants := make([]dto.TripUser, 0)

	if len(dbTrip.Participants) > 0 {
		err := json.Unmarshal(dbTrip.Participants, &participants)

		if err != nil {
			return dto.Trip{}, err
		}
	}

	amenities := make([]dto.Amenity, 0)

	if len(dbTrip.Amenities) > 0 {
		err := json.Unmarshal(dbTrip.Amenities, &amenities)

		if err != nil {
			return dto.Trip{}, err
		}
	}

	locations := make([]dto.TripLocation, 0)

	if len(dbTrip.Locations) > 0 {
		err := json.Unmarshal(dbTrip.Locations, &locations)

		if err != nil {
			return dto.Trip{}, err
		}
	}

	pois, err := ToPois(dbTrip.Pois)

	if err != nil {
		return dto.Trip{}, err
	}

	for i, loc := range locations {
		var poi *dto.Poi

		for _, p := range pois {
			if p.ID == loc.PoiID {
				poi = &p
				break
			}
		}

		if poi == nil {
			return dto.Trip{}, fmt.Errorf("poi not found: %s", loc.PoiID)
		}

		locations[i].Poi = *poi
	}

	return dto.Trip{
		ID:                 dbTrip.Trip.ID,
		OwnerID:            dbTrip.Trip.OwnerID,
		Title:              dbTrip.Trip.Title,
		Description:        dbTrip.Trip.Description,
		VisibilityLevel:    ToTripVisibilityLevel(dbTrip.Trip.VisibilityLevel),
		StartAt:            dbTrip.Trip.StartAt.Time,
		EndAt:              dbTrip.Trip.EndAt.Time,
		CreatedAt:          dbTrip.Trip.CreatedAt.Time,
		UpdatedAt:          dbTrip.Trip.UpdatedAt.Time,
		Owner:              owner,
		Participants:       participants,
		RequestedAmenities: amenities,
		Locations:          locations,
	}, nil
}

func ToTripInviteFromInvitesByUserIdRow(dbInvite db.GetInvitesByToUserIdRow) (dto.TripInvite, error) {
	var fromUser dto.TripUser

	err := json.Unmarshal(dbInvite.Fromuser, &fromUser)

	if err != nil {
		return dto.TripInvite{}, err
	}

	return dto.TripInvite{
		ID:        dbInvite.TripInvite.ID,
		TripID:    dbInvite.TripInvite.TripID,
		From:      fromUser,
		To:        dto.TripUser{},
		SentAt:    dbInvite.TripInvite.SentAt.Time,
		ExpiresAt: dbInvite.TripInvite.ExpiresAt.Time,
		TripTitle: dbInvite.TripInvite.TripTitle,
		Role:      dto.TripRole(dbInvite.TripInvite.Role),
	}, nil
}

func ToTripInviteFromInvitesByTripIdRow(dbInvite db.GetInvitesByTripIdRow) (dto.TripInvite, error) {
	var fromUser dto.TripUser

	err := json.Unmarshal(dbInvite.Fromuser, &fromUser)

	if err != nil {
		return dto.TripInvite{}, err
	}

	var toUser dto.TripUser

	err = json.Unmarshal(dbInvite.Touser, &toUser)

	if err != nil {
		return dto.TripInvite{}, err
	}

	return dto.TripInvite{
		ID:        dbInvite.TripInvite.ID,
		TripID:    dbInvite.TripInvite.TripID,
		From:      fromUser,
		To:        toUser,
		SentAt:    dbInvite.TripInvite.SentAt.Time,
		ExpiresAt: dbInvite.TripInvite.ExpiresAt.Time,
		TripTitle: dbInvite.TripInvite.TripTitle,
		Role:      dto.TripRole(dbInvite.TripInvite.Role),
	}, nil
}

func ToTripComment(dbComment db.GetTripCommentsRow) (dto.TripComment, error) {
	var user dto.TripUser

	err := json.Unmarshal(dbComment.User, &user)

	if err != nil {
		return dto.TripComment{}, err
	}

	return dto.TripComment{
		ID:        dbComment.TripComment.ID,
		TripID:    dbComment.TripComment.TripID,
		From:      user,
		Content:   dbComment.TripComment.Content,
		CreatedAt: dbComment.TripComment.CreatedAt.Time,
	}, nil
}

func ToTripCommentFromCommentByIdRow(dbComment db.GetTripCommentByIdRow) (dto.TripComment, error) {
	var user dto.TripUser

	err := json.Unmarshal(dbComment.User, &user)

	if err != nil {
		return dto.TripComment{}, err
	}

	return dto.TripComment{
		ID:        dbComment.TripComment.ID,
		TripID:    dbComment.TripComment.TripID,
		From:      user,
		Content:   dbComment.TripComment.Content,
		CreatedAt: dbComment.TripComment.CreatedAt.Time,
	}, nil
}
