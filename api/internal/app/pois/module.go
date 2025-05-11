package pois

import (
	"context"
	"net/http"
	"wanderlust/internal/pkg/authz"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/dto"
	"wanderlust/internal/pkg/middlewares"

	"github.com/danielgtaylor/huma/v2"
)

func Register(grp *huma.Group, app *core.Application) {
	s := Service{
		App: app,
	}

	grp.UseSimpleModifier(func(op *huma.Operation) {
		op.Tags = []string{"Point of Interests"}
	})

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/pois/{id}",
			Summary:       "Get Point of Interest",
			Description:   "Get a point of interest by ID",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.WithAuth(grp.API),
			},
		},
		func(ctx context.Context, input *dto.GetPoiByIdInput) (*dto.GetPoiByIdOutput, error) {
			userId := ctx.Value("userId").(string)

			res, err := s.getPoiById(input.ID)

			if err != nil {
				return nil, err
			}

			isFavorite := false
			isBookmarked := false

			if userId != "" {
				isFavorite = s.isFavorite(input.ID, userId)
				isBookmarked = s.isBookmarked(input.ID, userId)
			}

			return &dto.GetPoiByIdOutput{
				Body: dto.GetPoiByIdOutputBody{
					Poi: *res,
					Meta: dto.GetPoiByIdMeta{
						IsFavorite:   isFavorite,
						IsBookmarked: isBookmarked,
					},
				},
			}, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/pois/peek",
			Summary:       "Peek Point of Interests",
			Description:   "Get 25 pois",
			DefaultStatus: http.StatusOK,
		},
		func(ctx context.Context, input *struct{}) (*dto.PeekPoisOutput, error) {
			res, err := s.peekPois()

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/pois/drafts",
			Summary:       "Create Draft",
			Description:   "Create a new draft",
			DefaultStatus: http.StatusCreated,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActPoiDraftCreate),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *struct{}) (*dto.CreatePoiDraftOutput, error) {
			res, err := s.createDraft()

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/pois/drafts",
			Summary:       "Get All Drafts",
			Description:   "Get all drafts",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActPoiDraftRead),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *struct{}) (*dto.GetAllPoiDraftsOutput, error) {
			res, err := s.getDrafts()

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/pois/drafts/{id}",
			Summary:       "Get Draft by ID",
			Description:   "Get a draft by id",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActPoiDraftRead),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.GetPoiDraftInput) (*dto.GetPoiDraftOutput, error) {
			res, err := s.getDraft(input.ID)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPatch,
			Path:          "/pois/drafts/{id}",
			Summary:       "Update Draft by ID",
			Description:   "Update a draft by id",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActPoiDraftCreate),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.UpdatePoiDraftInput) (*dto.UpdatePoiDraftOutput, error) {
			res, err := s.updateDraft(input.ID, input.Body)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/pois/drafts/{id}/media",
			Summary:       "Upload Media for a Draft",
			Description:   "Upload media for a draft",
			DefaultStatus: http.StatusCreated,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActPoiDraftCreate),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.UploadPoiMediaInput) (*dto.UpdatePoiDraftOutput, error) {
			userId := ctx.Value("userId").(string)
			res, err := s.uploadMedia(userId, input.ID, input.Body)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodDelete,
			Path:          "/pois/drafts/{id}/media/{index}",
			Summary:       "Delete Draft Media",
			Description:   "Delete a draft media by index",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActPoiDraftCreate),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.DeletePoiMediaInput) (*dto.UpdatePoiDraftOutput, error) {
			res, err := s.deleteMedia(input.ID, input.Index)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodDelete,
			Path:          "/pois/drafts/{id}",
			Summary:       "Delete Draft",
			Description:   "Delete a draft",
			DefaultStatus: http.StatusNoContent,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActPoiDraftCreate),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.DeletePoiDraftInput) (*struct{}, error) {
			err := s.deleteDraft(input.ID, true)

			if err != nil {
				return nil, err
			}

			return nil, nil
		},
	)

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/pois/drafts/{id}/publish",
			Summary:       "Publish Draft",
			Description:   "Publish a draft",
			DefaultStatus: http.StatusCreated,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
				middlewares.Authz(grp.API, authz.ActPoiDraftCreate),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.PublishPoiDraftInput) (*dto.PublishPoiDraftOutput, error) {
			res, err := s.publishDraft(input.ID)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)
}
