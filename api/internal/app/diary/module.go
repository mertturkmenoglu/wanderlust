package diary

import (
	"context"
	"net/http"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/dto"
	"wanderlust/internal/pkg/middlewares"

	"github.com/danielgtaylor/huma/v2"
)

func Register(grp *huma.Group, app *core.Application) {
	s := Service{
		app: app,
	}

	grp.UseSimpleModifier(func(op *huma.Operation) {
		op.Tags = []string{"Diary"}
	})

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
			userId := ctx.Value("userId").(string)
			res, err := s.list(userId, input.PaginationQueryParams, input.DiaryDateFilterQueryParams)

			if err != nil {
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
			userId := ctx.Value("userId").(string)
			res, err := s.getById(userId, input.ID)

			if err != nil {
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
			userId := ctx.Value("userId").(string)
			err := s.changeSharing(userId, input.ID)

			if err != nil {
				return nil, err
			}

			return nil, nil
		},
	)

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
			userId := ctx.Value("userId").(string)
			res, err := s.create(userId, input.Body)

			if err != nil {
				return nil, err
			}

			return res, nil
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
			userId := ctx.Value("userId").(string)
			err := s.remove(userId, input.ID)

			if err != nil {
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
			userId := ctx.Value("userId").(string)
			res, err := s.uploadMedia(userId, input.ID, input.Body)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)
}
