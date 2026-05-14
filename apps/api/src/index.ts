import 'reflect-metadata';

import { AuthService } from '@wanderlust/auth';
import { ConfigService } from '@wanderlust/config';
import { initLogger } from 'evlog';
import { type EvlogVariables, evlog } from 'evlog/hono';
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { compress } from 'hono/compress';
import { getApiHandler, getRpcHandler } from '@/routes/handler';
import { bootstrapServices, container } from './ioc';
import { createContext } from './lib/context';
import { getCorsConfig } from './middlewares/cors';
import { evlogAuth } from './middlewares/evlog-auth';

initLogger({
	env: {
		service: 'wanderlust-api',
	},
});

await bootstrapServices();

const app = new Hono<EvlogVariables>();
const cfg = container.get(ConfigService).get();
const auth = container.get(AuthService).get();

app.use(evlog());
app.use('*', evlogAuth(auth));
app.use('/*', getCorsConfig(cfg));
app.use('/uploads/*', serveStatic({ root: './' }));
app.use(compress());
app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw));

const api = getApiHandler();
const rpc = getRpcHandler();

app.use('/*', async (c, next) => {
	const isRpcRequest = c.req.path.startsWith('/rpc');
	const handler = isRpcRequest ? rpc : api;

	const res = await handler.handle(c.req.raw, {
		prefix: isRpcRequest ? '/rpc' : '/api',
		// @ts-expect-error Context type inference
		context: await createContext({ context: c, container }),
	});

	if (res.matched) {
		return c.newResponse(res.response.body, res.response);
	}

	await next();
});

export default {
	port: cfg.api.port,
	fetch: app.fetch,
};
