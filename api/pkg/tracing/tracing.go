package tracing

import (
	"context"
	Log "log"
	"time"

	"go.opentelemetry.io/contrib/bridges/otelslog"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/log/global"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/sdk/log"
	"go.opentelemetry.io/otel/sdk/metric"
	"go.opentelemetry.io/otel/sdk/resource"
	"go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.4.0"
)

var Slog = otelslog.NewLogger("wanderlust")

func Init() func() {
	otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(
		propagation.TraceContext{},
		propagation.Baggage{},
	))

	traceExporter := TraceExporter()

	tp := trace.NewTracerProvider(
		trace.WithBatcher(traceExporter),
		trace.WithResource(Resource()),
	)

	otel.SetTracerProvider(tp)

	metricExporter := MetricExporter()

	mp := metric.NewMeterProvider(
		metric.WithResource(Resource()),
		metric.WithReader(metric.NewPeriodicReader(metricExporter,
			metric.WithInterval(1*time.Second),
		)),
	)

	otel.SetMeterProvider(mp)

	logExporter := LogExporter()

	lp := log.NewLoggerProvider(
		log.WithResource(Resource()),
		log.WithProcessor(log.NewBatchProcessor(logExporter)),
	)

	global.SetLoggerProvider(lp)

	return func() {
		if err := tp.Shutdown(context.Background()); err != nil {
			Log.Fatal(err)
		}

		if err := mp.Shutdown(context.Background()); err != nil {
			Log.Fatal(err)
		}

		if err := lp.Shutdown(context.Background()); err != nil {
			Log.Fatal(err)
		}
	}
}

func Resource() *resource.Resource {
	return resource.NewWithAttributes(
		semconv.SchemaURL,
		semconv.ServiceNameKey.String("wanderlust"),
		semconv.ServiceVersionKey.String("2.0.0."),
		attribute.String("environment", "dev"),
	)
}
