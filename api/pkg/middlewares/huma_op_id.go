package middlewares

import (
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
	"go.opentelemetry.io/otel/attribute"
)

func HumaOperationID() func(ctx huma.Context, next func(huma.Context)) {
	return func(ctx huma.Context, next func(huma.Context)) {
		oid := ctx.Operation().OperationID

		if oid == "" {
			oid = ctx.Operation().Summary
		}

		_, sp := tracing.NewSpanWithName(ctx.Context(), oid)
		defer sp.End()

		sp.SetAttributes(attribute.String("operation-id", oid))
		next(ctx)
	}
}
