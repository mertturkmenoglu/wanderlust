package aggregator

import (
	"context"
	"fmt"
	"net/http"
	"sync"
	"wanderlust/app/pois"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/di"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/tracing"

	"github.com/cockroachdb/errors"
	"github.com/danielgtaylor/huma/v2"
	"golang.org/x/sync/singleflight"
)

func Register(grp *huma.Group, app *core.Application) {
	dbSvc := app.Get(di.SVC_DB).(*db.Db)
	cacheSvc := app.Get(di.SVC_CACHE).(*cache.Cache)

	s := Service{
		repo: &Repository{
			db:         dbSvc.Queries,
			poiService: pois.NewService(app),
		},
		cacheMutex:   sync.RWMutex{},
		requestGroup: singleflight.Group{},
		cache:        cacheSvc,
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
				sp.RecordError(errors.New(fmt.Sprintf("%+v", err)))
				return nil, err
			}

			return res, nil
		},
	)

}
