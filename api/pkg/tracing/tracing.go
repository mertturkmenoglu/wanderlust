package tracing

import (
	"context"
	"runtime"
	"strings"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/trace"
)

func GetFnName() string {
	pc, _, _, ok := runtime.Caller(2)
	if !ok {
		return "unknown"
	}
	fn := runtime.FuncForPC(pc)
	name := fn.Name()
	parts := strings.Split(name, "/")
	return parts[len(parts)-1]
}

func NewSpan(ctx context.Context) (context.Context, trace.Span) {
	return NewSpanWithName(ctx, GetFnName())
}

func NewSpanWithName(ctx context.Context, name string) (context.Context, trace.Span) {
	tracer := otel.Tracer("")
	return tracer.Start(ctx, name)
}
