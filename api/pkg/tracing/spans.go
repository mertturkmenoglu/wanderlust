package tracing

import (
	"context"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/trace"
)

func NewSpan(ctx context.Context) (context.Context, trace.Span) {
	return NewSpanWithName(ctx, GetFnName())
}

func NewSpanWithName(ctx context.Context, name string) (context.Context, trace.Span) {
	tracer := otel.Tracer("")
	return tracer.Start(ctx, name)
}
