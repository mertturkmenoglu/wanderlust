package trips

import (
	"time"
	"wanderlust/pkg/dto"

	"github.com/danielgtaylor/huma/v2"
)

type GetTripByIdInput struct {
	ID string `path:"id" example:"7323488942953598976" required:"true" doc:"Trip ID"`
}

type GetTripByIdOutput struct {
	Body GetTripByIdOutputBody
}

type GetTripByIdOutputBody struct {
	Trip dto.Trip `json:"trip"`
}

type GetTripInvitesByTripIdInput struct {
	ID string `path:"id" example:"7323488942953598976" required:"true" doc:"Trip ID"`
}

type GetTripInvitesByTripIdOutput struct {
	Body GetTripInvitesByTripIdOutputBody
}

type GetTripInvitesByTripIdOutputBody struct {
	Invites []dto.TripInvite `json:"invites"`
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
	Invite dto.TripInvite `json:"invite"`
}

type GetAllTripsInput struct {
	dto.PaginationQueryParams
}

type GetAllTripsOutput struct {
	Body GetAllTripsOutputBody
}

type GetAllTripsOutputBody struct {
	Trips      []dto.Trip         `json:"trips"`
	Pagination dto.PaginationInfo `json:"pagination"`
}

type GetMyTripInvitesInput struct {
}

type GetMyTripInvitesOutput struct {
	Body GetMyTripInvitesOutputBody
}

type GetMyTripInvitesOutputBody struct {
	Invites []dto.TripInvite `json:"invites"`
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
	Trip dto.Trip `json:"trip"`
}

type GetTripInviteDetailsInput struct {
	TripID   string `path:"tripId" example:"7323488942953598976" required:"true" doc:"Trip ID"`
	InviteID string `path:"inviteId" example:"7323488942953598976" required:"true" doc:"Invite ID"`
}

type GetTripInviteDetailsOutput struct {
	Body GetTripInviteDetailsOutputBody
}

type GetTripInviteDetailsOutputBody struct {
	InviteDetail dto.TripInviteDetail `json:"inviteDetail"`
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

type DeleteTripInviteOutput struct {
}

type DeleteTripParticipantInput struct {
	TripID        string `path:"tripId" example:"7323488942953598976" required:"true" doc:"Trip ID"`
	ParticipantID string `path:"participantId" example:"7323488942953598976" required:"true" doc:"Participant User ID"`
}

type DeleteTripParticipantOutput struct {
}

type DeleteTripInput struct {
	ID string `path:"id" example:"7323488942953598976" required:"true" doc:"Trip ID"`
}

type DeleteTripOutput struct {
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
	Comment dto.TripComment `json:"comment"`
}

type GetTripCommentsInput struct {
	ID string `path:"id" example:"7323488942953598976" required:"true" doc:"Trip ID"`
	dto.PaginationQueryParams
}

type GetTripCommentsOutput struct {
	Body GetTripCommentsOutputBody
}

type GetTripCommentsOutputBody struct {
	Comments   []dto.TripComment  `json:"comments"`
	Pagination dto.PaginationInfo `json:"pagination"`
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
	Comment dto.TripComment `json:"comment"`
}

type DeleteTripCommentInput struct {
	TripID    string `path:"tripId" example:"7323488942953598976" required:"true" doc:"Trip ID"`
	CommentID string `path:"commentId" example:"7323488942953598976" required:"true" doc:"Comment ID"`
}

type DeleteTripCommentOutput struct {
}

type UpdateTripInput struct {
	ID   string `path:"id" example:"7323488942953598976" doc:"Trip ID" required:"true"`
	Body UpdateTripInputBody
}

type UpdateTripInputBody struct {
	Title           string    `json:"title" example:"My Trip" doc:"Trip title" minLength:"1" maxLength:"128"`
	Description     string    `json:"description" example:"My trip description" doc:"Trip description" minLength:"0" maxLength:"1024"`
	VisibilityLevel string    `json:"visibilityLevel" example:"public" doc:"Trip visibility level" enum:"public,friends,private"`
	StartAt         time.Time `json:"startAt" example:"2023-05-01T00:00:00Z" doc:"Start datetime of the trip" format:"date-time"`
	EndAt           time.Time `json:"endAt" example:"2023-05-01T00:00:00Z" doc:"End datetime of the trip" format:"date-time"`
}

func (body *UpdateTripInputBody) Resolve(ctx huma.Context, prefix *huma.PathBuffer) []error {
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

type UpdateTripOutput struct {
	Body UpdateTripOutputBody
}

type UpdateTripOutputBody struct {
	Trip dto.Trip `json:"trip"`
}

type CreateTripPlaceInput struct {
	ID   string `path:"id" example:"7323488942953598976" required:"true" doc:"Trip ID"`
	Body CreateTripPlaceInputBody
}

type CreateTripPlaceInputBody struct {
	PlaceID       string    `json:"placeId" example:"7323488942953598976" doc:"Place ID"`
	ScheduledTime time.Time `json:"scheduledTime" example:"2023-05-01T00:00:00Z" doc:"Scheduled time of the location visit" format:"date-time"`
	Description   *string   `json:"description" example:"My awesome location" doc:"Description of the location" required:"false"`
}

type CreateTripPlaceOutput struct {
	Body CreateTripPlaceOutputBody
}

type CreateTripPlaceOutputBody struct {
	Place dto.TripPlace `json:"place"`
}

type UpdateTripPlaceInput struct {
	TripID      string `path:"tripId" example:"7323488942953598976" required:"true" doc:"Trip ID"`
	TripPlaceID string `path:"tripPlaceId" example:"7323488942953598976" required:"true" doc:"Trip Place ID"`
	Body        UpdateTripPlaceInputBody
}

type UpdateTripPlaceInputBody struct {
	Description   *string    `json:"description" example:"My awesome place" doc:"Description of the place" required:"false"`
	ScheduledTime *time.Time `json:"scheduledTime" example:"2023-05-01T00:00:00Z" doc:"Scheduled time of the place" required:"false" format:"date-time"`
}

type UpdateTripPlaceOutput struct {
	Body UpdateTripPlaceOutputBody
}

type UpdateTripPlaceOutputBody struct {
	Place dto.TripPlace `json:"place"`
}

type DeleteTripPlaceInput struct {
	TripID      string `path:"tripId" example:"7323488942953598976" required:"true" doc:"Trip ID"`
	TripPlaceID string `path:"tripPlaceId" example:"7323488942953598976" required:"true" doc:"Trip place ID"`
}

type DeleteTripPlaceOutput struct {
}