import { trace } from '@opentelemetry/api';
import { OpenAPIHandler } from '@orpc/openapi/fetch';
import { onError } from '@orpc/server';
import { RPCHandler } from '@orpc/server/fetch';
import { devErrorLogger } from '@/lib/dev-error-logger';
import { openApiReference } from '@/lib/open-api-reference';
import { getAppRouter } from '.';

export function getHandlers() {
	const appRouter = getAppRouter();

	const api = new OpenAPIHandler(appRouter, {
		plugins: [openApiReference],
		interceptors: [onError(devErrorLogger)],
	});

	const rpc = new RPCHandler(appRouter, {
		interceptors: [
			onError(devErrorLogger),
			({ request, next }) => {
				const span = trace.getActiveSpan();

				request.signal?.addEventListener('abort', () => {
					span?.addEvent('aborted', { reason: String(request.signal?.reason) });
				});

				return next();
			},
		],
	});

	return {
		api,
		rpc,
	};
}
