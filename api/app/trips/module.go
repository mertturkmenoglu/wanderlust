package trips

import (
	"context"
	"net/http"
	"wanderlust/pkg/core"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/middlewares"

	"github.com/danielgtaylor/huma/v2"
)

// Get Trip By ID
// Get My Trips
// Get Invites
// Create Trip
// Invite Participants
// Accept/Decline Invite
// Edit Trip
// Delete Trip
// Create/Update/Delete Comment
// Create/Update/Delete Amenity
// Add/Update/Delete Location
// Edit Trip Details

func Register(grp *huma.Group, app *core.Application) {
	s := Service{
		app: app,
	}

	grp.UseSimpleModifier(func(op *huma.Operation) {
		op.Tags = []string{"Trips"}
	})

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
		},
		func(ctx context.Context, input *dto.GetTripByIdInput) (*dto.GetTripByIdOutput, error) {
			res, err := s.getTripById(ctx, input.ID)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)
}
