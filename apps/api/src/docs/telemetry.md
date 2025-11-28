# Telemetry

- We are using OpenTelemetry and Grafana stack to monitor the application.
- It was a huge pain to set up the stack and I'm still not sure if I set it up correctly. Please help.

## Grafana LGTM

- Grafana has `grafana/otel-lgtm` Docker image that is intended to be used for development environments.
- We are currently using it.
- Parts of the stack:
  - Loki: Logs database
  - Tempo: Traces database
  - Prometheus: Metrics database
  - Grafana: Visualization tool
  - OpenTelemetry Collector: Collects traces and metrics
- Port `3010` (originally `3000`) is used for Grafana.
- Go to `http://localhost:3010` in your browser to access Grafana.
- Under `Drilldown` menu, you can access logs, traces, metrics, and profiles.

## Telemetry Setup

- Application expectes these envrionment variables to be set:

  - `OTLP_ENDPOINT`: OTel Collector endpoint.
  - `OTLP_WRITER_ENDPOINT`: OTel Collector endpoint for logs.
  - `OTLP_LOGS_URL_PATH`: OTel Collector path for logs.
  - `OTLP_TRACE_URL_PATH`: OTel Collector path for traces.
  - `OTLP_METRICS_URL_PATH`: OTel Collector path for metrics.

- Endpoint should look like this: `localhost:4318`.
- Writer endpoint should look like this: `http://localhost:4318/v1/logs`.
- Paths should look like this: `/v1/traces`, `/v1/metrics`, `/v1/logs`.

## Tracing Package

- Go to `pkg/tracing` folder.
- You can see the tracing initalization inside `pkg/tracing/tracing.go` file.
- `exporters.go` file sets up tracing, metrics, and logs exporters.
- `spans.go` file contains utility functions for creating spans easily.

## Usage

- Whenever you want to trace a function, you can use `tracing.NewSpan` function.
- Pass the HTTP request context to the function.
- You must call `span.End()` function yourself.
- You can use `span.RecordError` function to record errors.
- You can use `span.AddEvent` function to add events to the span.
- Example:

```go

func (s *Service) fooBar(ctx context.Context) (string, error) {
  ctx, sp := tracing.NewSpan(ctx)
  defer sp.End()

  val, ok := sp.cache.has("foo-bar")

  if ok {
    return val, nil
  }

  sp.AddEvent("cache.miss", trace.WithAttributes(
    attribute.String("cache-key", "foo-bar"),
  ))

  result, err := s.db.GetFooBar(ctx)

  if err != nil {
    sp.RecordError(err)
    return "", err
  }

  _ = sp.cache.set("foo-bar", result)

  return result, nil
}
```
