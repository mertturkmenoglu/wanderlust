package diaries

import (
	"context"
	"fmt"
	"net/http"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/di"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/middlewares"
	"wanderlust/pkg/tracing"

	"github.com/cockroachdb/errors"
	"github.com/danielgtaylor/huma/v2"
)

func Register(grp *huma.Group, app *core.Application) {
	dbSvc := app.Get(di.SVC_DB).(*db.Db)
	cacheSvc := app.Get(di.SVC_CACHE).(*cache.Cache)

	s := Service{
		repo: &Repository{
			db:   dbSvc.Queries,
			pool: dbSvc.Pool,
		},
		cache: cacheSvc,
	}

	grp.UseSimpleModifier(func(op *huma.Operation) {
		op.Tags = []string{"Diary"}
	})

	// Create Diary
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/diary/",
			Summary:       "Create Diary",
			Description:   "Create a diary",
			DefaultStatus: http.StatusCreated,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.CreateDiaryInput) (*dto.CreateDiaryOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.create(ctx, input.Body)

			if err != nil {
				sp.RecordError(errors.New(fmt.Sprintf("%+v", err)))
				return nil, err
			}

			return res, nil
		},
	)

	// List Diaries
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/diary/",
			Summary:       "List Diaries",
			Description:   "List diaries for the current user",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.GetDiariesInput) (*dto.GetDiariesOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.list(ctx, input.PaginationQueryParams, input.DiaryDateFilterQueryParams)

			if err != nil {
				sp.RecordError(errors.New(fmt.Sprintf("%+v", err)))
				return nil, err
			}

			return res, nil
		},
	)

	// Get Diary
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/diary/{id}",
			Summary:       "Get Diary",
			Description:   "Get a diary by ID",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.GetDiaryByIdInput) (*dto.GetDiaryByIdOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.get(ctx, input.ID)

			if err != nil {
				sp.RecordError(errors.New(fmt.Sprintf("%+v", err)))
				return nil, err
			}

			return res, nil
		},
	)

	// Delete Diary
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodDelete,
			Path:          "/diary/{id}",
			Summary:       "Delete Diary",
			Description:   "Delete a diary",
			DefaultStatus: http.StatusNoContent,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.DeleteDiaryInput) (*struct{}, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			err := s.remove(ctx, input.ID)

			if err != nil {
				sp.RecordError(errors.New(fmt.Sprintf("%+v", err)))
				return nil, err
			}

			return nil, nil
		},
	)

	// Upload image
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/diary/{id}/image",
			Summary:       "Upload Image to a Diary",
			Description:   "Add image to a diary",
			DefaultStatus: http.StatusCreated,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.UploadDiaryImageInput) (*dto.UploadDiaryImageOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.uploadImage(ctx, input.ID, input.Body)

			if err != nil {
				sp.RecordError(errors.New(fmt.Sprintf("%+v", err)))
				return nil, err
			}

			return res, nil
		},
	)

	// Delete Image
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodDelete,
			Path:          "/diary/{id}/image/{imageId}",
			Summary:       "Delete Diary Image",
			Description:   "Delete a diary image",
			DefaultStatus: http.StatusNoContent,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.DeleteDiaryImageInput) (*struct{}, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			err := s.removeImage(ctx, input.ID, input.ImageID)

			if err != nil {
				sp.RecordError(errors.New(fmt.Sprintf("%+v", err)))
				return nil, err
			}

			return nil, nil
		},
	)

	// Update Diary Image
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPatch,
			Path:          "/diary/{id}/image",
			Summary:       "Update Diary Image",
			Description:   "Update a diary image",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.UpdateDiaryImageInput) (*dto.UpdateDiaryImageOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.updateImage(ctx, input.ID, input.Body)

			if err != nil {
				sp.RecordError(errors.New(fmt.Sprintf("%+v", err)))
				return nil, err
			}

			return res, nil
		},
	)

	// Update Diary
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPatch,
			Path:          "/diary/{id}",
			Summary:       "Update Diary",
			Description:   "Update a diary",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.UpdateDiaryInput) (*dto.UpdateDiaryOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.update(ctx, input.ID, input.Body)

			if err != nil {
				sp.RecordError(errors.New(fmt.Sprintf("%+v", err)))
				return nil, err
			}

			return res, nil
		},
	)

	// Update Diary Friends
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPatch,
			Path:          "/diary/{id}/friends",
			Summary:       "Update Diary Friends",
			Description:   "Update a diary friends",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.UpdateDiaryFriendsInput) (*dto.UpdateDiaryFriendsOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.updateFriends(ctx, input.ID, input.Body)

			if err != nil {
				sp.RecordError(errors.New(fmt.Sprintf("%+v", err)))
				return nil, err
			}

			return res, nil
		},
	)

	// Update Diary Locations
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPatch,
			Path:          "/diary/{id}/locations",
			Summary:       "Update Diary Locations",
			Description:   "Update a diary locations",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.UpdateDiaryLocationsInput) (*dto.UpdateDiaryLocationsOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.updateLocations(ctx, input.ID, input.Body)

			if err != nil {
				sp.RecordError(errors.New(fmt.Sprintf("%+v", err)))
				return nil, err
			}

			return res, nil
		},
	)
}
