package trips

import (
	"context"
	"net/http"
	"sync"
	"wanderlust/pkg/core"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/middlewares"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
)

func Register(grp *huma.Group, app *core.Application) {
	s := Service{
		*app,
		&sync.WaitGroup{},
		app.Db.Queries,
		app.Db.Pool,
	}

	grp.UseSimpleModifier(func(op *huma.Operation) {
		op.Tags = []string{"Trips"}
	})

	// Get Trip
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/trips/{id}",
			Summary:       "Get Trip",
			Description:   "Get a trip by its ID",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.GetTripByIdInput) (*dto.GetTripByIdOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.getTripById(ctx, input.ID)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	// Get Invites for a Trip
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/trips/{id}/invites",
			Summary:       "Get Invites for a Trip",
			Description:   "Get all invites for a trip",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.GetTripInvitesByTripIdInput) (*dto.GetTripInvitesByTripIdOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.getInvitesByTripId(ctx, input.ID)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	// Invite Participants
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/trips/{id}/invite",
			Summary:       "Invite Participants",
			Description:   "Invite participants to a trip",
			DefaultStatus: http.StatusCreated,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.CreateTripInviteInput) (*dto.CreateTripInviteOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.createInvite(ctx, input.ID, input.Body)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	// Get My Trips
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/trips/",
			Summary:       "Get My Trips",
			Description:   "Get all trips for the current user",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *struct{}) (*dto.GetAllTripsOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.getAllTrips(ctx)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	// Get My Invites
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/trips/invites",
			Summary:       "Get My Invites",
			Description:   "Get all invites for the current user",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *struct{}) (*dto.GetMyTripInvitesOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.getMyInvites(ctx)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	// Create Trip
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/trips/",
			Summary:       "Create Trip",
			Description:   "Create a new trip",
			DefaultStatus: http.StatusCreated,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.CreateTripInput) (*dto.CreateTripOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.create(ctx, input.Body)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	// Get Trip Invite Details
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/trips/{tripId}/invites/{inviteId}",
			Summary:       "Get Trip Invite Details",
			Description:   "Get a trip invite details by its ID",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.GetTripInviteDetailsInput) (*dto.GetTripInviteDetailsOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.getInviteDetail(ctx, input.TripID, input.InviteID)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	// Accept/Decline Trip Invite
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/trips/{tripId}/invites/{inviteId}/{action}",
			Summary:       "Accept/Decline Trip Invite",
			Description:   "Accept/Decline a trip invite by its ID",
			DefaultStatus: http.StatusAccepted,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.TripInviteActionInput) (*dto.TripInviteActionOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.acceptOrDeclineInvite(ctx, input.TripID, input.InviteID, input.Action)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	// Remove Invite
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodDelete,
			Path:          "/trips/{tripId}/invites/{inviteId}",
			Summary:       "Remove Invite",
			Description:   "Remove an invite by its ID",
			DefaultStatus: http.StatusNoContent,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.DeleteTripInviteInput) (*struct{}, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			err := s.removeInvite(ctx, input.TripID, input.InviteID)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return nil, nil
		},
	)

	// Remove Participant
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodDelete,
			Path:          "/trips/{tripId}/participants/{participantId}",
			Summary:       "Remove Participant",
			Description:   "Remove a participant from a trip",
			DefaultStatus: http.StatusNoContent,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.DeleteTripParticipantInput) (*struct{}, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			err := s.removeParticipant(ctx, input.TripID, input.ParticipantID)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return nil, nil
		},
	)

	// Delete Trip
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodDelete,
			Path:          "/trips/{id}",
			Summary:       "Delete Trip",
			Description:   "Delete a trip",
			DefaultStatus: http.StatusNoContent,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.DeleteTripInput) (*struct{}, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			err := s.removeTrip(ctx, input.ID)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return nil, nil
		},
	)

	// Create Comment
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/trips/{id}/comments/",
			Summary:       "Create Comment",
			Description:   "Create a comment for a trip",
			DefaultStatus: http.StatusCreated,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.CreateTripCommentInput) (*dto.CreateTripCommentOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.createComment(ctx, input.ID, input.Body)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	// Get Trip Comments
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/trips/{id}/comments/",
			Summary:       "Get Trip Comments",
			Description:   "Get comments for a trip",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.GetTripCommentsInput) (*dto.GetTripCommentsOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.getComments(ctx, input.ID, input.PaginationQueryParams)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	// Update Trip Comment
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPatch,
			Path:          "/trips/{tripId}/comments/{commentId}",
			Summary:       "Update Trip Comment",
			Description:   "Update a comment for a trip",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.UpdateTripCommentInput) (*dto.UpdateTripCommentOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.updateComment(ctx, input)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	// Delete Trip Comment
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodDelete,
			Path:          "/trips/{tripId}/comments/{commentId}",
			Summary:       "Delete Trip Comment",
			Description:   "Delete a trip comment",
			DefaultStatus: http.StatusNoContent,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.DeleteTripCommentInput) (*struct{}, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			err := s.removeComment(ctx, input.TripID, input.CommentID)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return nil, nil
		},
	)

	// Update Trip Amenities
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPatch,
			Path:          "/trips/{id}/amenities",
			Summary:       "Manage Trip Amenities",
			Description:   "Manage trip amenities by trip id",
			DefaultStatus: http.StatusCreated,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.UpdateTripAmenitiesInput) (*dto.UpdateTripAmenitiesOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.updateAmenities(ctx, input.ID, input.Body)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	// Edit Trip
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPatch,
			Path:          "/trips/{id}",
			Summary:       "Update Trip",
			Description:   "Update a trip",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.UpdateTripInput) (*dto.UpdateTripOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.updateTrip(ctx, input.ID, input.Body)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	// Create Trip Location
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/trips/{id}/locations",
			Summary:       "Add Location to Trip",
			Description:   "Add a location to a trip",
			DefaultStatus: http.StatusCreated,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.CreateTripLocationInput) (*dto.CreateTripLocationOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.createTripLocation(ctx, input.ID, input.Body)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	// Update Trip Location
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPatch,
			Path:          "/trips/{tripId}/locations/{locationId}",
			Summary:       "Update Trip Location",
			Description:   "Update a trip location",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.UpdateTripLocationInput) (*dto.UpdateTripLocationOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.updateTripLocation(ctx, input)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	// Delete Trip Location
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodDelete,
			Path:          "/trips/{tripId}/locations/{locationId}",
			Summary:       "Remove Trip Location",
			Description:   "Remove a trip location",
			DefaultStatus: http.StatusNoContent,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.DeleteTripLocationInput) (*struct{}, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			err := s.removeTripLocation(ctx, input.TripID, input.LocationID)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return nil, nil
		},
	)
}
