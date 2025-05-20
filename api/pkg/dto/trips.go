package dto

import (
	"time"

	"github.com/danielgtaylor/huma/v2"
)

type Trip struct {
	ID                 string              `json:"id" example:"7323488942953598976" doc:"Trip ID"`
	OwnerID            string              `json:"ownerId" example:"7323488942953598976" doc:"Owner User ID"`
	Owner              TripUser            `json:"owner"`
	Title              string              `json:"title" example:"My Awesome Trip" doc:"Title of the trip"`
	Description        string              `json:"description" example:"Lorem ipsum dolor sit amet" doc:"Description of the trip"`
	Status             TripStatus          `json:"status" example:"draft" doc:"Status of the trip"`
	VisibilityLevel    TripVisibilityLevel `json:"visibilityLevel" example:"friends" doc:"Visibility level of the trip"`
	StartAt            time.Time           `json:"startAt" example:"2023-05-01T00:00:00Z" doc:"Start datetime of the trip"`
	EndAt              time.Time           `json:"endAt" example:"2023-05-01T00:00:00Z" doc:"End datetime of the trip"`
	Participants       []TripUser          `json:"participants"`
	Locations          []TripLocation      `json:"locations"`
	RequestedAmenities []Amenity           `json:"requestedAmenities"`
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
	ID              string    `json:"id" example:"7323488942953598976" doc:"ID of invite"`
	TripID          string    `json:"tripId" example:"7323488942953598976" doc:"Trip ID"`
	From            TripUser  `json:"from"`
	To              TripUser  `json:"to"`
	SentAt          time.Time `json:"sentAt" example:"2023-05-01T00:00:00Z" doc:"Sent at time of invite"`
	ExpiresAt       time.Time `json:"expiresAt" example:"2023-05-01T00:00:00Z" doc:"Expires at time of invite"`
	TripTitle       string    `json:"tripTitle" example:"My Awesome Trip" doc:"Title of the trip"`
	TripDescription string    `json:"tripDescription" example:"Lorem ipsum dolor sit amet" doc:"Description of the trip"`
	Role            TripRole  `json:"role" example:"participant" doc:"Role of invite"`
}

type TripInviteDetail struct {
	TripInvite
	TripTitle string    `json:"tripTitle" example:"My Awesome Trip" doc:"Title of the trip"`
	StartAt   time.Time `json:"startAt" example:"2023-05-01T00:00:00Z" doc:"Start datetime of the trip"`
	EndAt     time.Time `json:"endAt" example:"2023-05-01T00:00:00Z" doc:"End datetime of the trip"`
}

type TripComment struct {
	ID        string    `json:"id" example:"7323488942953598976" doc:"ID of comment"`
	TripID    string    `json:"tripId" example:"7323488942953598976" doc:"Trip ID"`
	From      TripUser  `json:"from"`
	Content   string    `json:"content" example:"This is a comment" doc:"Content of comment"`
	CreatedAt time.Time `json:"createdAt" example:"2023-05-01T00:00:00Z" doc:"Created at time of the comment"`
}

type TripLocation struct {
	TripID        string    `json:"tripId" example:"7323488942953598976" doc:"Trip ID"`
	ScheduledTime time.Time `json:"scheduledTime" example:"2023-05-01T00:00:00Z" doc:"Scheduled time of the location"`
	Description   string    `json:"description" example:"Lorem ipsum dolor sit amet" doc:"Description of the location"`
	PoiID         string    `json:"poiId" example:"7323488942953598976" doc:"Point of Interest ID"`
	Poi           Poi       `json:"poi"`
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
	ID string `path:"id" example:"7323488942953598976" required:"true" doc:"Trip ID"`
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
	Title       string    `json:"title" example:"My Awesome Trip" doc:"Title of the trip" minLength:"1" maxLength:"128"`
	Description string    `json:"description" example:"Lorem ipsum dolor sit amet" doc:"Description of the trip" minLength:"0" maxLength:"1024"`
	Visibility  string    `json:"visibility" example:"friends" doc:"Visibility level of the trip" enum:"public,private,friends"`
	StartAt     time.Time `json:"startAt" example:"2023-05-01T00:00:00Z" doc:"Start datetime of the trip" format:"date-time"`
	EndAt       time.Time `json:"endAt" example:"2023-05-01T00:00:00Z" doc:"End datetime of the trip" format:"date-time"`
}

func (body *CreateTripInputBody) Resolve(ctx huma.Context, prefix *huma.PathBuffer) []error {
	if body.StartAt.After(body.EndAt) {
		return []error{&huma.ErrorDetail{
			Message:  "Start date must be before end date",
			Location: prefix.With("startAt"),
			Value:    body.StartAt,
		}}
	}

	if body.StartAt.Before(time.Now()) {
		return []error{&huma.ErrorDetail{
			Message:  "Start date must be in the future",
			Location: prefix.With("startAt"),
			Value:    body.StartAt,
		}}
	}

	return nil
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

type GetTripInviteDetailsInput struct {
	TripID   string `path:"tripId" example:"7323488942953598976" required:"true" doc:"Trip ID"`
	InviteID string `path:"inviteId" example:"7323488942953598976" required:"true" doc:"Invite ID"`
}

type GetTripInviteDetailsOutput struct {
	Body GetTripInviteDetailsOutputBody
}

type GetTripInviteDetailsOutputBody struct {
	InviteDetail TripInviteDetail `json:"inviteDetail"`
}

type TripInviteActionInput struct {
	TripID   string `path:"tripId" example:"7323488942953598976" required:"true" doc:"Trip ID"`
	InviteID string `path:"inviteId" example:"7323488942953598976" required:"true" doc:"Invite ID"`
	Action   string `path:"action" example:"accept" required:"true" doc:"Action to perform on the invite" enum:"accept,decline"`
}

type TripInviteActionOutput struct {
	Body TripInviteActionOutputBody
}

type TripInviteActionOutputBody struct {
	Accepted bool `json:"accepted"`
}

type DeleteTripInviteInput struct {
	TripID   string `path:"tripId" example:"7323488942953598976" required:"true" doc:"Trip ID"`
	InviteID string `path:"inviteId" example:"7323488942953598976" required:"true" doc:"Invite ID"`
}

type DeleteTripParticipantInput struct {
	TripID        string `path:"tripId" example:"7323488942953598976" required:"true" doc:"Trip ID"`
	ParticipantID string `path:"participantId" example:"7323488942953598976" required:"true" doc:"Participant User ID"`
}

type DeleteTripInput struct {
	ID string `path:"id" example:"7323488942953598976" required:"true" doc:"Trip ID"`
}

type CreateTripCommentInput struct {
	ID   string `path:"id" example:"7323488942953598976" required:"true" doc:"Trip ID"`
	Body CreateTripCommentInputBody
}

type CreateTripCommentInputBody struct {
	Content string `json:"content" example:"This is a comment" doc:"Content of comment" minLength:"1" maxLength:"255"`
}

type CreateTripCommentOutput struct {
	Body CreateTripCommentOutputBody
}

type CreateTripCommentOutputBody struct {
	Comment TripComment `json:"comment"`
}

type GetTripCommentsInput struct {
	ID string `path:"id" example:"7323488942953598976" required:"true" doc:"Trip ID"`
	PaginationQueryParams
}

type GetTripCommentsOutput struct {
	Body GetTripCommentsOutputBody
}

type GetTripCommentsOutputBody struct {
	Comments   []TripComment  `json:"comments"`
	Pagination PaginationInfo `json:"pagination"`
}

type UpdateTripCommentInput struct {
	TripID    string `path:"tripId" example:"7323488942953598976" required:"true" doc:"Trip ID"`
	CommentID string `path:"commentId" example:"7323488942953598976" required:"true" doc:"Comment ID"`
	Body      UpdateTripCommentInputBody
}

type UpdateTripCommentInputBody struct {
	Content string `json:"content" example:"This is a comment" doc:"Content of comment" minLength:"1" maxLength:"255"`
}

type UpdateTripCommentOutput struct {
	Body UpdateTripCommentOutputBody
}

type UpdateTripCommentOutputBody struct {
	Comment TripComment `json:"comment"`
}

type DeleteTripCommentInput struct {
	TripID    string `path:"tripId" example:"7323488942953598976" required:"true" doc:"Trip ID"`
	CommentID string `path:"commentId" example:"7323488942953598976" required:"true" doc:"Comment ID"`
}

type UpdateTripAmenitiesInput struct {
	ID   string `path:"id" example:"7323488942953598976" required:"true" doc:"Trip ID"`
	Body UpdateTripAmenitiesInputBody
}

type UpdateTripAmenitiesInputBody struct {
	AmenityIds []int32 `json:"amenityIds" example:"[7323488942953598976]" doc:"Amenities IDs" minItems:"1" maxItems:"50" uniqueItems:"true"`
}

type UpdateTripAmenitiesOutput struct {
	Body UpdateTripAmenitiesOutputBody
}

type UpdateTripAmenitiesOutputBody struct {
	Amenities []Amenity `json:"amenities"`
}
