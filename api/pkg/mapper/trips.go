package mapper

import (
	"encoding/json"
	"fmt"
	"time"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"

	"github.com/danielgtaylor/huma/v2"
)

func ToTripStatus(dbStatus string) (dto.TripStatus, error) {
	switch dbStatus {
	case "active":
		return dto.TRIP_STATUS_ACTIVE, nil
	case "canceled":
		return dto.TRIP_STATUS_CANCELED, nil
	case "draft":
		return dto.TRIP_STATUS_DRAFT, nil
	default:
		return "", fmt.Errorf("invalid status: %s", dbStatus)
	}
}

func ToTripVisibilityLevel(dbVisibility string) (dto.TripVisibilityLevel, error) {
	switch dbVisibility {
	case "public":
		return dto.TRIP_VISIBILITY_LEVEL_PUBLIC, nil
	case "friends":
		return dto.TRIP_VISIBILITY_LEVEL_FRIENDS, nil
	case "private":
		return dto.TRIP_VISIBILITY_LEVEL_PRIVATE, nil
	default:
		return "", fmt.Errorf("invalid visibility level: %s", dbVisibility)
	}
}

func ToTrip(dbTrip db.GetTripsByIdsPopulatedRow) (dto.Trip, error) {
	status, err := ToTripStatus(dbTrip.Trip.Status)

	if err != nil {
		return dto.Trip{}, err
	}

	visibility, err := ToTripVisibilityLevel(dbTrip.Trip.VisibilityLevel)

	if err != nil {
		return dto.Trip{}, err
	}

	var owner dto.TripUser

	if len(dbTrip.Owner) == 0 {
		return dto.Trip{}, fmt.Errorf("failed to get owner")
	}

	err = json.Unmarshal(dbTrip.Owner, &owner)

	if err != nil {
		return dto.Trip{}, fmt.Errorf("failed to unmarshal owner: %v", err)
	}

	var amenities []dto.Amenity

	if len(dbTrip.Amenities) != 0 {
		err := json.Unmarshal(dbTrip.Amenities, &amenities)

		if err != nil {
			return dto.Trip{}, fmt.Errorf("failed to unmarshal amenities: %v", err)
		}
	} else {
		amenities = make([]dto.Amenity, 0)
	}

	var participants []dto.TripUser

	if len(dbTrip.Participants) != 0 {
		err := json.Unmarshal(dbTrip.Participants, &participants)

		if err != nil {
			return dto.Trip{}, fmt.Errorf("failed to unmarshal participants: %v", err)
		}
	} else {
		participants = make([]dto.TripUser, 0)
	}

	type Location struct {
		ID            string    `json:"id"`
		TripID        string    `json:"tripId"`
		ScheduledTime time.Time `json:"scheduledTime"`
		Description   string    `json:"description"`
		PoiID         string    `json:"poiId"`
	}

	var dbLocations []Location

	if len(dbTrip.Locations) != 0 {
		err := json.Unmarshal(dbTrip.Locations, &dbLocations)

		if err != nil {
			return dto.Trip{}, fmt.Errorf("failed to unmarshal locations: %v", err)
		}
	} else {
		dbLocations = make([]Location, 0)
	}

	ps, ok := dbTrip.Ps.([]any)

	if !ok {
		return dto.Trip{}, fmt.Errorf("failed to convert ps to []any")
	}

	pois := make([]dto.Poi, 0)

	for _, p := range ps {
		cast := p.(map[string]any)

		poi, err := ToPoiFromAggregateResult(PoiAggregateResult{
			Poi:          cast["poi"].(map[string]any),
			PoiAddress:   cast["poiAddress"].(map[string]any),
			PoiAmenities: cast["poiAmenities"].([]any),
			PoiCategory:  cast["poiCategory"].(map[string]any),
			PoiCity:      cast["poiCity"].(map[string]any),
			PoiMedia:     cast["poiMedia"].([]any),
		})

		if err != nil {
			return dto.Trip{}, err
		}

		pois = append(pois, poi)
	}

	locations := make([]dto.TripLocation, 0)

	for _, dbLocation := range dbLocations {
		var poi *dto.Poi = nil

		for _, p := range pois {
			if p.ID == dbLocation.PoiID {
				poi = &p
			}
		}

		if poi == nil {
			continue
		}

		locations = append(locations, dto.TripLocation{
			ID:            dbLocation.ID,
			TripID:        dbLocation.TripID,
			ScheduledTime: dbLocation.ScheduledTime,
			Description:   dbLocation.Description,
			PoiID:         dbLocation.PoiID,
			Poi:           *poi,
		})
	}

	return dto.Trip{
		ID:                 dbTrip.Trip.ID,
		OwnerID:            dbTrip.Trip.OwnerID,
		Title:              dbTrip.Trip.Title,
		Description:        dbTrip.Trip.Description,
		Status:             status,
		VisibilityLevel:    visibility,
		StartAt:            dbTrip.Trip.StartAt.Time,
		EndAt:              dbTrip.Trip.EndAt.Time,
		CreatedAt:          dbTrip.Trip.CreatedAt.Time,
		UpdatedAt:          dbTrip.Trip.UpdatedAt.Time,
		Owner:              owner,
		RequestedAmenities: amenities,
		Participants:       participants,
		Locations:          locations,
	}, nil
}

func ToTripInviteRole(dbRole string) (dto.TripRole, error) {
	switch dbRole {
	case "participant":
		return dto.TRIP_ROLE_PARTICIPANT, nil
	case "editor":
		return dto.TRIP_ROLE_EDITOR, nil
	default:
		return "", fmt.Errorf("invalid role: %s", dbRole)
	}
}

func FromToUserRowToTripInvite(dbTripInvite db.GetInvitesByToUserIdRow) (dto.TripInvite, error) {
	var role dto.TripRole = dto.TRIP_ROLE_PARTICIPANT

	role, err := ToTripInviteRole(dbTripInvite.TripInvite.Role)

	if err != nil {
		return dto.TripInvite{}, err
	}

	var fromUser dto.TripUser

	err = json.Unmarshal(dbTripInvite.Fromuser, &fromUser)

	if err != nil {
		return dto.TripInvite{}, huma.Error500InternalServerError("Failed to get invites")
	}

	return dto.TripInvite{
		ID:     dbTripInvite.TripInvite.ID,
		TripID: dbTripInvite.TripInvite.TripID,
		From:   fromUser,
		To: dto.TripUser{
			ID: dbTripInvite.TripInvite.ToID,
		},
		SentAt:          dbTripInvite.TripInvite.SentAt.Time,
		ExpiresAt:       dbTripInvite.TripInvite.ExpiresAt.Time,
		Role:            role,
		TripTitle:       dbTripInvite.TripInvite.TripTitle,
		TripDescription: dbTripInvite.TripInvite.TripDescription,
	}, nil
}

func FromTripRowToTripInvite(dbInvite db.GetInvitesByTripIdRow) (dto.TripInvite, error) {
	role, err := ToTripInviteRole(dbInvite.TripInvite.Role)

	if err != nil {
		return dto.TripInvite{}, err
	}

	var fromUser dto.TripUser

	err = json.Unmarshal(dbInvite.Fromuser, &fromUser)

	if err != nil {
		return dto.TripInvite{}, huma.Error500InternalServerError("Failed to get invites")
	}

	var toUser dto.TripUser

	err = json.Unmarshal(dbInvite.Touser, &toUser)

	if err != nil {
		return dto.TripInvite{}, huma.Error500InternalServerError("Failed to get invites")
	}

	return dto.TripInvite{
		ID:              dbInvite.TripInvite.ID,
		TripID:          dbInvite.TripInvite.TripID,
		From:            fromUser,
		To:              toUser,
		SentAt:          dbInvite.TripInvite.SentAt.Time,
		ExpiresAt:       dbInvite.TripInvite.ExpiresAt.Time,
		Role:            role,
		TripTitle:       dbInvite.TripInvite.TripTitle,
		TripDescription: dbInvite.TripInvite.TripDescription,
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
		Content:   dbComment.TripComment.Content,
		CreatedAt: dbComment.TripComment.CreatedAt.Time,
		From:      user,
	}, nil
}

func FromSingleDbTripCommentToTripComment(dbComment db.GetTripCommentByIdRow) (dto.TripComment, error) {
	var user dto.TripUser

	err := json.Unmarshal(dbComment.User, &user)

	if err != nil {
		return dto.TripComment{}, err
	}

	return dto.TripComment{
		ID:        dbComment.TripComment.ID,
		TripID:    dbComment.TripComment.TripID,
		Content:   dbComment.TripComment.Content,
		CreatedAt: dbComment.TripComment.CreatedAt.Time,
		From:      user,
	}, nil
}
