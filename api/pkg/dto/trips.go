package dto

import "time"

type Trip struct {
	ID                 string              `json:"id" example:"7323488942953598976" doc:"Trip ID"`
	OwnerID            string              `json:"ownerId" example:"7323488942953598976" doc:"Owner User ID"`
	Owner              TripUser            `json:"owner"`
	Title              string              `json:"title" example:"My Awesome Trip" doc:"Title of the trip"`
	Status             TripStatus          `json:"status" example:"draft" doc:"Status of the trip"`
	VisibilityLevel    TripVisibilityLevel `json:"visibilityLevel" example:"friends" doc:"Visibility level of the trip"`
	StartAt            time.Time           `json:"startAt" example:"2023-05-01T00:00:00Z" doc:"Start datetime of the trip"`
	EndAt              time.Time           `json:"endAt" example:"2023-05-01T00:00:00Z" doc:"End datetime of the trip"`
	Days               []TripDay           `json:"days"`
	Participants       []TripUser          `json:"participants"`
	RequestedAmenities []Amenity           `json:"requestedAmenities"`
	Comments           []TripComment       `json:"comments"`
	CreatedAt          time.Time           `json:"createdAt" example:"2023-05-01T00:00:00Z" doc:"Created at time of trip"`
	UpdatedAt          time.Time           `json:"updatedAt" example:"2023-05-01T00:00:00Z" doc:"Updated at time of trip"`
}

type TripUser struct {
	ID           string `json:"id" example:"7323488942953598976" doc:"User ID"`
	FullName     string `json:"fullName" example:"John Doe" doc:"User full name"`
	Username     string `json:"username" example:"johndoe" doc:"Username"`
	ProfileImage string `json:"profileImage" example:"http://example.com/image.png" doc:"Profile image URL of the user"`
	Role         string `json:"role" example:"participant" doc:"Role of the user" enum:"participant,editor"`
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
	TRIP_ROLE_PARTICIPANT TripRole = "participant"
	TRIP_ROLE_EDITOR      TripRole = "editor"
)

type TripInvite struct {
	ID        string    `json:"id" example:"7323488942953598976" doc:"ID of invite"`
	TripID    string    `json:"tripId" example:"7323488942953598976" doc:"Trip ID"`
	From      TripUser  `json:"from"`
	To        TripUser  `json:"to"`
	SentAt    time.Time `json:"sentAt" example:"2023-05-01T00:00:00Z" doc:"Sent at time of invite"`
	ExpiresAt time.Time `json:"expiresAt" example:"2023-05-01T00:00:00Z" doc:"Expires at time of invite"`
	Role      TripRole  `json:"role" example:"participant" doc:"Role of invite"`
}

type TripComment struct {
	ID        string    `json:"id" example:"7323488942953598976" doc:"ID of comment"`
	From      TripUser  `json:"from"`
	Content   string    `json:"content" example:"This is a comment" doc:"Content of comment"`
	CreatedAt time.Time `json:"createdAt" example:"2023-05-01T00:00:00Z" doc:"Created at time of the comment"`
}

type TripDay struct {
	TripID      string         `json:"tripId" example:"7323488942953598976" doc:"Trip ID"`
	DayNo       int32          `json:"dayNo" example:"3" doc:"Day number"`
	Description string         `json:"description" example:"Lorem ipsum" doc:"Description of the day"`
	Locations   []TripLocation `json:"locations"`
}

type TripLocation struct {
	TripID string `json:"tripId" example:"7323488942953598976" doc:"Trip ID"`
	DayNo  int32  `json:"dayNo" example:"3" doc:"Day number"`
	PoiID  string `json:"poiId" example:"7323488942953598976" doc:"Point of Interest ID"`
	Poi    Poi    `json:"poi"`
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

type GetTripInvitesByTripIdInput struct {
	TripID string `path:"tripId" example:"7323488942953598976" required:"true" doc:"Trip ID"`
}

type GetTripInvitesByTripIdOutput struct {
	Body GetTripInvitesByTripIdOutputBody
}

type GetTripInvitesByTripIdOutputBody struct {
	Invites []TripInvite `json:"invites"`
}

type GetAllTripsOutput struct {
	Body GetAllTripsOutputBody
}

type GetAllTripsOutputBody struct {
	Trips []Trip `json:"trips"`
}

type GetMyTripInvitesOutput struct {
	Body GetMyTripInvitesOutputBody
}

type GetMyTripInvitesOutputBody struct {
	Invites []TripInvite `json:"invites"`
}

type CreateTripInput struct {
	Body CreateTripInputBody
}

type CreateTripInputBody struct {
	Title      string `json:"title" example:"My Awesome Trip" doc:"Title of the trip" minLength:"1" maxLength:"128"`
	Visibility string `json:"visibility" example:"friends" doc:"Visibility level of the trip" enum:"public,private,friends"`
}

type CreateTripOutput struct {
	Body CreateTripOutputBody
}

type CreateTripOutputBody struct {
	Trip Trip `json:"trip"`
}

type CreateTripInviteInput struct {
	ID   string `path:"id" example:"7323488942953598976" required:"true" doc:"Trip ID"`
	Body CreateTripInviteInputBody
}

type CreateTripInviteInputBody struct {
	ToID string `json:"toId" example:"7323488942953598976" doc:"User ID"`
	Role string `json:"role" example:"participant" doc:"Role of invite" enum:"participant,editor"`
}

type CreateTripInviteOutput struct {
	Body CreateTripInviteOutputBody
}

type CreateTripInviteOutputBody struct {
	Invite TripInvite `json:"invite"`
}
