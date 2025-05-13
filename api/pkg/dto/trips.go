package dto

import "time"

type Trip struct {
	ID                 string              `json:"id"`
	OwnerID            string              `json:"ownerId"`
	Owner              TripUser            `json:"owner"`
	Status             TripStatus          `json:"status"`
	VisibilityLevel    TripVisibilityLevel `json:"visibilityLevel"`
	StartAt            time.Time           `json:"startAt"`
	EndAt              time.Time           `json:"endAt"`
	Days               []TripDay           `json:"days"`
	Participants       []TripUser          `json:"participants"`
	RequestedAmenities []Amenity           `json:"requestedAmenities"`
	Comments           []TripComment       `json:"comments"`
	CreatedAt          time.Time           `json:"createdAt"`
	UpdatedAt          time.Time           `json:"updatedAt"`
}

type TripUser struct {
	ID           string `json:"id"`
	FullName     string `json:"fullName"`
	Username     string `json:"username"`
	ProfileImage string `json:"profileImage"`
}

type TripStatus string

const (
	TRIP_STATUS_DRAFT    TripStatus = "draft"
	TRIP_STATUS_ACTIVE   TripStatus = "active"
	TRIP_STATUS_CANCELED TripStatus = "canceled"
)

type TripVisibilityLevel string

const (
	TRIP_VISIBILITY_LEVEL_PUBLIC  TripVisibilityLevel = "public"
	TRIP_VISIBILITY_LEVEL_PRIVATE TripVisibilityLevel = "private"
	TRIP_VISIBILITY_LEVEL_FRIENDS TripVisibilityLevel = "friends"
)

type TripRole string

const (
	TRIP_ROLE_OWNER       TripRole = "owner"
	TRIP_ROLE_PARTICIPANT TripRole = "participant"
	TRIP_ROLE_EDITOR      TripRole = "editor"
)

type TripInvite struct {
	ID        string    `json:"id"`
	From      TripUser  `json:"from"`
	To        TripUser  `json:"to"`
	SentAt    time.Time `json:"sentAt"`
	ExpiresAt time.Time `json:"expiresAt"`
	Role      TripRole  `json:"role"`
}

type TripComment struct {
	ID        string    `json:"id"`
	From      TripUser  `json:"from"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"createdAt"`
}

type TripDay struct {
	TripID      string         `json:"tripId"`
	DayNo       int32          `json:"dayNo"`
	Description string         `json:"description"`
	Locations   []TripLocation `json:"locations"`
}

type TripLocation struct {
	TripID      string `json:"tripId"`
	DayNo       int32  `json:"dayNo"`
	Description string `json:"description"`
	PoiID       string `json:"poiId"`
	Poi         Poi    `json:"poi"`
}

type GetTripByIdInput struct {
	ID string `path:"id" example:"7323488942953598976" required:"true" doc:"Trip ID"`
}

type GetTripByIdOutput struct {
	Body GetTripByIdOutputBody
}

type GetTripByIdOutputBody struct {
	Trip Trip `json:"trip"`
}
