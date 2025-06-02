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
		otlptracehttp.WithEndpoint(cfg.Env.OTLPEndpoint),
		otlptracehttp.WithURLPath(cfg.Env.OTLPTracesUrlPath),
		otlptracehttp.WithInsecure(),
		otlptracehttp.WithHeaders(map[string]string{
			"Authorization": "Basic " + cfg.Env.OTLPAuthToken,
		}),
	)

	if err != nil {
		log.Fatal(err)
	}

	return exporter
}

func MetricExporter() *otlpmetrichttp.Exporter {
	metricExporter, err := otlpmetrichttp.New(context.Background(),
		otlpmetrichttp.WithEndpoint(cfg.Env.OTLPEndpoint),
		otlpmetrichttp.WithURLPath(cfg.Env.OTLPMetricsUrlPath),
		otlpmetrichttp.WithInsecure(),
		otlpmetrichttp.WithHeaders(map[string]string{
			"Authorization": "Basic " + cfg.Env.OTLPAuthToken,
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
		otlploghttp.WithEndpoint(cfg.Env.OTLPEndpoint),
		otlploghttp.WithURLPath(cfg.Env.OTLPLogsUrlPath),
		otlploghttp.WithInsecure(),
		otlploghttp.WithHeaders(map[string]string{
			"Authorization": "Basic " + cfg.Env.OTLPAuthToken,
		}),
	)

	if err != nil {
		log.Fatal(err)
	}

	return logExporter
}
