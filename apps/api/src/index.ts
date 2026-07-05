import 'reflect-metadata';
import './lib/instrumentation';

import { httpInstrumentationMiddleware } from '@hono/otel';
import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { bootstrapServices } from './bootstrap';
import { getCorsConfig } from './middlewares/cors';
import { matchHandler } from './middlewares/match-handler';
import { requestLogger } from './middlewares/request-logger';
import { getHandlers } from './routes/handler';

const { cfg, auth } = await bootstrapServices();

const app = new Hono()
	.use(compress())
	.use(
		'*',
		httpInstrumentationMiddleware({
			serviceName: 'wl-api',
			spanNameFactory(c) {
				return `HTTP ${c.req.method} ${c.req.path}`;
			},
		}),
	)
	.use('*', requestLogger)
	.use('/*', getCorsConfig(cfg))
	.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw))
	.use('/*', matchHandler(getHandlers()));

export default {
	port: cfg.api.port,
	fetch: app.fetch,
};
