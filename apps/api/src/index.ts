import 'reflect-metadata';

import { AuthService } from '@wanderlust/auth';
import { ConfigService } from '@wanderlust/config';
import consola from 'consola';
import { getApiHandler, getRpcHandler } from '@/routes/handler';
import { bootstrapServices, container } from './ioc';
import { createContext } from './lib/context';
import { timeFnAsync } from './lib/timer';
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
		routes: {
			'/uploads/*': (req) => {
				const url = new URL(req.url);
				return new Response(Bun.file(`./${url.pathname}`));
			},
			'/api/auth/*': async (req) => {
				const res = await auth.handler(req);
				return withCors(res);
			},
		},
		async fetch(request) {
			const [res, duration] = await timeFnAsync(async () => {
				if (request.method === 'OPTIONS') {
					return withCors(new Response(null, { status: 204 }));
				}

				const isRpcRequest = new URL(request.url).pathname.startsWith('/rpc');
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
			});

			logger(request, res, duration);
			return res;
		},
	});

	consola.info(
		`API server is running on http://${server.hostname}:${server.port}/`,
	);
}

await main();
