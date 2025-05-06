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

	// routes.POST("/media", m.handlers.UploadMedia, middlewares.IsAuth, middlewares.Authz(authz.ActPoiMediaUpload))
	// routes.DELETE("/media", m.handlers.DeleteMedia, middlewares.IsAuth, middlewares.Authz(authz.ActPoiMediaDelete))
	// routes.DELETE("/drafts/:id", m.handlers.DeleteDraft, middlewares.IsAuth, middlewares.Authz(authz.ActPoiDraftDelete))
	// routes.PATCH("/drafts/:id", m.handlers.UpdateDraft, middlewares.IsAuth, middlewares.Authz(authz.ActPoiDraftUpdate))
	// routes.POST("/drafts/:id/publish", m.handlers.PublishDraft, middlewares.IsAuth, middlewares.Authz(authz.ActPoiDraftPublish))

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

}
