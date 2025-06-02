package core

import (
	"wanderlust/pkg/middlewares"

	"github.com/danielgtaylor/huma/v2"
)

type RegisterFunc func(grp *huma.Group, app *Application)

func (w *Wanderlust) Routing(fns ...RegisterFunc) {
	grp := huma.NewGroup(*w.api, API_PREFIX)

	grp.UseMiddleware(middlewares.HumaOperationID())

	for _, fn := range fns {
		fn(grp, w.app)
	}
}
