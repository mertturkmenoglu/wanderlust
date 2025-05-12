package utils

import (
	"context"
	"runtime"
	"strings"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/trace"
)

func GetFnName() string {
	pc, _, _, ok := runtime.Caller(1)
	if !ok {
		return "unknown"
	}
	fn := runtime.FuncForPC(pc)
	name := fn.Name()
	parts := strings.Split(name, "/")
	return parts[len(parts)-1]
}

func NewSpan(ctx context.Context, name string) trace.Span {
	tracer := otel.Tracer("")
	_, sp := tracer.Start(ctx, name)
	return sp
}
