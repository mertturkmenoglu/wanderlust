package diary

import (
	"context"
	"net/http"
	"wanderlust/pkg/core"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/middlewares"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
)

// POST /diary/ 							Create Diary Entry
// GET /diary/:id 							Get Diary Entry By ID
// GET /diary/ List 						Diary Entries
// PATCH /diary/:id 						Update Diary Entry
// DELETE /diary/:id 						Delete Diary Entry
// POST /diary/:id/friends 					Add Friend
// DELETE /diary/:id/friends/:friendId 		Remove Friend
// PATCH /diary/:id/friends 				Update Friends
// POST /diary/:id/media 					Upload Media
// PATCH /diary/:id/media 					Update Media
// DELETE /diary/:id/media/:mediaId 		Remove Media
// POST /diary/:id/locations 				Add Location
// PATCH /diary/:id/locations 				Update Location
// DELETE /diary/:id/locations/:locationId 	Remove Location

func Register(grp *huma.Group, app *core.Application) {
	s := Service{
		app,
		app.Db.Queries,
		app.Db.Pool,
	}

	grp.UseSimpleModifier(func(op *huma.Operation) {
		op.Tags = []string{"Diary"}
	})

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/diary/",
			Summary:       "Create Diary Entry",
			Description:   "Create a diary entry",
			DefaultStatus: http.StatusCreated,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.CreateDiaryEntryInput) (*dto.CreateDiaryEntryOutput, error) {
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

	////////////////////////////////

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/diary/",
			Summary:       "List Diary Entries",
			Description:   "List diary entries for the current user",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.GetDiaryEntriesInput) (*dto.GetDiaryEntriesOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.list(ctx, input.PaginationQueryParams, input.DiaryDateFilterQueryParams)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/diary/{id}",
			Summary:       "Get Diary Entry",
			Description:   "Get a diary entry by ID",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.GetDiaryEntryByIdInput) (*dto.GetDiaryEntryByIdOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.get(ctx, input.ID)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPatch,
			Path:          "/diary/{id}/sharing",
			Summary:       "Change Diary Entry Sharing",
			Description:   "Change the sharing of a diary entry",
			DefaultStatus: http.StatusNoContent,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.ChangeDiaryEntySharingInput) (*struct{}, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			err := s.changeSharing(ctx, input.ID)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return nil, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodDelete,
			Path:          "/diary/{id}",
			Summary:       "Delete Diary Entry",
			Description:   "Delete a diary entry",
			DefaultStatus: http.StatusNoContent,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.DeleteDiaryEntryInput) (*struct{}, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			err := s.remove(ctx, input.ID)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return nil, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/diary/{id}/media",
			Summary:       "Upload Media to a Diary Entry",
			Description:   "Add media to a diary entry",
			DefaultStatus: http.StatusCreated,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.UploadDiaryMediaInput) (*dto.UploadDiaryMediaOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.uploadMedia(ctx, input.ID, input.Body)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)
}
