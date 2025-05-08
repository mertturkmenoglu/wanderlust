package reviews

import (
	"context"
	"net/http"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/dto"

	"github.com/danielgtaylor/huma/v2"
)

func Register(grp *huma.Group, app *core.Application) {
	s := Service{
		app: app,
	}

	grp.UseSimpleModifier(func(op *huma.Operation) {
		op.Tags = []string{"Reviews"}
	})

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/reviews/{id}",
			Summary:       "Get Review by ID",
			Description:   "Get a review by ID",
			DefaultStatus: http.StatusOK,
		},
		func(ctx context.Context, input *dto.GetReviewByIdInput) (*dto.GetReviewByIdOutput, error) {
			res, err := s.get(input.ID)

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)
}
