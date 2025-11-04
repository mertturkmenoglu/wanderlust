package trips

import (
	"context"
	"net/http"
	"wanderlust/app/places"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/di"
	"wanderlust/pkg/middlewares"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
)

func Register(grp *huma.Group, app *core.Application) {
	dbSvc := app.Get(di.SVC_DB).(*db.Db)

	s := Service{
		placesService: places.NewService(app),
		repo: &Repository{
			db:   dbSvc.Queries,
			pool: dbSvc.Pool,
		},
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
		func(ctx context.Context, input *GetTripByIdInput) (*GetTripByIdOutput, error) {
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
		func(ctx context.Context, input *GetTripInvitesByTripIdInput) (*GetTripInvitesByTripIdOutput, error) {
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
		func(ctx context.Context, input *CreateTripInviteInput) (*CreateTripInviteOutput, error) {
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
		func(ctx context.Context, input *GetAllTripsInput) (*GetAllTripsOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.getAllTrips(ctx, input.PaginationQueryParams)

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
		func(ctx context.Context, input *GetMyTripInvitesInput) (*GetMyTripInvitesOutput, error) {
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
		func(ctx context.Context, input *CreateTripInput) (*CreateTripOutput, error) {
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
		func(ctx context.Context, input *GetTripInviteDetailsInput) (*GetTripInviteDetailsOutput, error) {
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
		func(ctx context.Context, input *TripInviteActionInput) (*TripInviteActionOutput, error) {
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
		func(ctx context.Context, input *DeleteTripInviteInput) (*DeleteTripInviteOutput, error) {
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
		func(ctx context.Context, input *DeleteTripParticipantInput) (*DeleteTripParticipantOutput, error) {
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
		func(ctx context.Context, input *DeleteTripInput) (*DeleteTripOutput, error) {
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
		func(ctx context.Context, input *CreateTripCommentInput) (*CreateTripCommentOutput, error) {
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
		func(ctx context.Context, input *GetTripCommentsInput) (*GetTripCommentsOutput, error) {
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
		func(ctx context.Context, input *UpdateTripCommentInput) (*UpdateTripCommentOutput, error) {
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
		func(ctx context.Context, input *DeleteTripCommentInput) (*DeleteTripCommentOutput, error) {
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
		func(ctx context.Context, input *UpdateTripInput) (*UpdateTripOutput, error) {
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
			Path:          "/trips/{id}/places",
			Summary:       "Add Place to Trip",
			Description:   "Add a place to a trip",
			DefaultStatus: http.StatusCreated,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *CreateTripPlaceInput) (*CreateTripPlaceOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.createTripPlace(ctx, input.ID, input.Body)

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
			Path:          "/trips/{tripId}/places/{tripPlaceId}",
			Summary:       "Update Trip Place",
			Description:   "Update a trip place",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *UpdateTripPlaceInput) (*UpdateTripPlaceOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.updateTripPlace(ctx, input)

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
			Path:          "/trips/{tripId}/places/{tripPlaceId}",
			Summary:       "Remove Trip Place",
			Description:   "Remove a trip place",
			DefaultStatus: http.StatusNoContent,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *DeleteTripPlaceInput) (*DeleteTripPlaceOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			err := s.removeTripPlace(ctx, input)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return nil, nil
		},
	)
}
