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
		interceptors: [onError(devErrorLogger)],
	});

	return {
		api,
		rpc,
	};
}
