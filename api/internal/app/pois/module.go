package pois

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
		op.Tags = []string{"Point of Interests"}
	})

	// routes.POST("/media", m.handlers.UploadMedia, middlewares.IsAuth, middlewares.Authz(authz.ActPoiMediaUpload))
	// routes.DELETE("/media", m.handlers.DeleteMedia, middlewares.IsAuth, middlewares.Authz(authz.ActPoiMediaDelete))
	// routes.POST("/drafts/new", m.handlers.CreateDraft, middlewares.IsAuth, middlewares.Authz(authz.ActPoiDraftCreate))
	// routes.GET("/drafts", m.handlers.GetDrafts, middlewares.IsAuth, middlewares.Authz(authz.ActPoiDraftCreate))
	// routes.GET("/drafts/:id", m.handlers.GetDraft, middlewares.IsAuth, middlewares.Authz(authz.ActPoiDraftRead))
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
}
