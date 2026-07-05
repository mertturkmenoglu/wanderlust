import { SpanStatusCode, trace } from '@opentelemetry/api';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { ORPCInstrumentation } from '@orpc/otel';

const traceExporter = new OTLPTraceExporter({
	url:
		process.env.TRACES_EXPORT_ENDPOINT ??
		'__no_traces_export_endpoint_provided',
});

const sdk = new NodeSDK({
	resource: resourceFromAttributes({
		'service.name': 'wl-api',
	}),
	spanProcessors: [new BatchSpanProcessor(traceExporter)],
	instrumentations: [
		getNodeAutoInstrumentations({
			'@opentelemetry/instrumentation-pg': {
				addSqlCommenterCommentToQueries: true,
				enabled: true,
				enhancedDatabaseReporting: true,
			},
		}),
		new ORPCInstrumentation(),
	],
});

sdk.start();

const tracer = trace.getTracer('uncaught-errors');

function recordError(eventName: string, reason: unknown) {
	const span = tracer.startSpan(eventName);
	const message = String(reason);

	if (reason instanceof Error) {
		span.recordException(reason);
	} else {
		span.recordException({ message });
	}

	span.setStatus({ code: SpanStatusCode.ERROR, message });
	span.end();
}

process.on('uncaughtException', (reason) => {
	recordError('uncaughtException', reason);
});

process.on('unhandledRejection', (reason) => {
	recordError('unhandledRejection', reason);
});
