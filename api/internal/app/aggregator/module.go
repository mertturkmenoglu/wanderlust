package aggregator

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
		op.Tags = []string{"Aggregations"}
	})

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/aggregator/home",
			Summary:       "Get Home Aggregation",
			Description:   "Get home aggregation",
			DefaultStatus: http.StatusOK,
		},
		func(ctx context.Context, input *struct{}) (*dto.HomeAggregatorOutput, error) {
			res, err := s.getHomeAggregation()

			if err != nil {
				return nil, err
			}

			return res, nil
		},
	)

}
