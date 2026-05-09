import 'reflect-metadata';

import { getApiHandler, getRpcHandler } from '@/routes/handler';
import { bootstrapServices, container } from './ioc';
import { AuthService } from './lib/auth';
import { ConfigService } from './lib/config';
import { createContext } from './lib/context';
import { withCors } from './middlewares/cors';
import { logger } from './middlewares/logger';

async function main() {
	await bootstrapServices();

	const cfg = container.get(ConfigService).get();
	const auth = container.get(AuthService).get();

	const api = getApiHandler();
	const rpc = getRpcHandler();

	const server = Bun.serve({
		port: cfg.api.port,
		async fetch(request) {
			const start = performance.now();

			const res = await (async () => {
				if (request.method === 'OPTIONS') {
					return withCors(new Response(null, { status: 204 }));
				}

				const url = new URL(request.url);

				if (url.pathname.startsWith('/uploads')) {
					return new Response(Bun.file(`./${url.pathname}`));
				}

				if (url.pathname.startsWith('/api/auth/')) {
					const res = await auth.handler(request);
					return withCors(res);
				}

				const isRpcRequest = url.pathname.startsWith('/rpc');
				const handler = isRpcRequest ? rpc : api;

				const res = await handler.handle(request, {
					prefix: isRpcRequest ? '/rpc' : '/api',
					// @ts-expect-error Context type inference
					context: await createContext({ request, container }),
				});

				const response = res.matched
					? res.response
					: new Response('Not Found', { status: 404 });

				return withCors(response);
			})();

			const duration = Math.round(performance.now() - start);

			logger(request, res, duration);
			return res;
		},
	});

	console.log(
		`API server is running on http://${server.hostname}:${server.port}/`,
	);
}

await main();
