package tracing

import (
	"context"
	"log"
	"wanderlust/pkg/cfg"

	"go.opentelemetry.io/otel/exporters/otlp/otlplog/otlploghttp"
	"go.opentelemetry.io/otel/exporters/otlp/otlpmetric/otlpmetrichttp"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp"
)

func TraceExporter() *otlptrace.Exporter {
	exporter, err := otlptracehttp.New(context.Background(),
		otlptracehttp.WithEndpoint(cfg.Env.OtlpEndpoint),
		otlptracehttp.WithURLPath(cfg.Env.OtlpTraceURLPath),
		otlptracehttp.WithInsecure(),
		otlptracehttp.WithHeaders(map[string]string{
			"Authorization": "Basic " + cfg.Env.OtlpAuthToken,
		}),
	)

	if err != nil {
		log.Fatal(err)
	}

	return exporter
}

func MetricExporter() *otlpmetrichttp.Exporter {
	metricExporter, err := otlpmetrichttp.New(context.Background(),
		otlpmetrichttp.WithEndpoint(cfg.Env.OtlpEndpoint),
		otlpmetrichttp.WithURLPath(cfg.Env.OtlpMetricsURLPath),
		otlpmetrichttp.WithInsecure(),
		otlpmetrichttp.WithHeaders(map[string]string{
			"Authorization": "Basic " + cfg.Env.OtlpAuthToken,
		}),
	)

	if err != nil {
		log.Fatal(err)
	}

	return metricExporter

}

func LogExporter() *otlploghttp.Exporter {
	logExporter, err := otlploghttp.New(
		context.Background(),
		otlploghttp.WithEndpoint(cfg.Env.OtlpEndpoint),
		otlploghttp.WithURLPath(cfg.Env.OtlpLogsURLPath),
		otlploghttp.WithInsecure(),
		otlploghttp.WithHeaders(map[string]string{
			"Authorization": "Basic " + cfg.Env.OtlpAuthToken,
		}),
	)

	if err != nil {
		log.Fatal(err)
	}

	return logExporter
}
