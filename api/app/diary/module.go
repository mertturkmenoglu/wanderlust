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

// POST /diary/:id/media 					Upload Media
// PATCH /diary/:id/media 					Update Media
// DELETE /diary/:id/media/:mediaId 		Remove Media

func Register(grp *huma.Group, app *core.Application) {
	s := Service{
		app,
		app.Db.Queries,
		app.Db.Pool,
	}

	grp.UseSimpleModifier(func(op *huma.Operation) {
		op.Tags = []string{"Diary"}
	})

	// Create Diary Entry
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

	// List Diary Entries
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

	// Get Diary Entry
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

	// Delete Diary Entry
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

	// Update Diary Entry
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPatch,
			Path:          "/diary/{id}",
			Summary:       "Update Diary Entry",
			Description:   "Update a diary entry",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.UpdateDiaryEntryInput) (*dto.UpdateDiaryEntryOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.update(ctx, input.ID, input.Body)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	// Update Diary Entry Friends
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPatch,
			Path:          "/diary/{id}/friends",
			Summary:       "Update Diary Entry Friends",
			Description:   "Update a diary entry friends",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.UpdateDiaryEntryFriendsInput) (*dto.UpdateDiaryEntryFriendsOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.updateFriends(ctx, input.ID, input.Body)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	// Update Diary Entry Locations
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPatch,
			Path:          "/diary/{id}/locations",
			Summary:       "Update Diary Entry Locations",
			Description:   "Update a diary entry locations",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.UpdateDiaryEntryLocationsInput) (*dto.UpdateDiaryEntryLocationsOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.updateLocations(ctx, input.ID, input.Body)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)
}
