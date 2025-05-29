package aggregator

import (
	"context"
	"net/http"
	"sync"
	"wanderlust/pkg/core"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
	"golang.org/x/sync/singleflight"
)

func Register(grp *huma.Group, app *core.Application) {
	s := Service{
		app:          app,
		cacheMutex:   sync.RWMutex{},
		requestGroup: singleflight.Group{},
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
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.getHomeAggregation(ctx)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

}
