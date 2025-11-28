import { getApiHandler, getRpcHandler } from '@/routes/handler';
import { bootstrapServices, ioc } from './ioc';
import { ConfigProvider } from './lib/config';
import { createContext } from './lib/context';
import { logger } from './middlewares/logger';

async function main() {
	await bootstrapServices();

	const config = ioc.resolve(ConfigProvider.id);

	const api = getApiHandler();
	const rpc = getRpcHandler();

	const server = Bun.serve({
		port: config.api.port,
		async fetch(request) {
			const start = performance.now();
			const url = new URL(request.url);

			const isRpcRequest = url.pathname.startsWith('/rpc');
			const handler = isRpcRequest ? rpc : api;
			const prefix = isRpcRequest ? '/rpc' : '/api';

			const res = await handler.handle(request, {
				prefix,
				// @ts-expect-error Context type inference
				context: await createContext({ request, ioc }),
			});

			const response = res.matched
				? res.response
				: new Response('Not Found', { status: 404 });

			const duration = Math.round(performance.now() - start);

			logger(request, response, duration);
			return response;
		},
	});

	console.log(`Server running on ${server.hostname}:${server.port}`);
}

await main();
