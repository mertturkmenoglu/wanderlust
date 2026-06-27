import 'reflect-metadata';

import { Hono } from 'hono';
import { bootstrapServices } from './bootstrap';
import { getCorsConfig } from './middlewares/cors';
import { matchHandler } from './middlewares/match-handler';
import { getHandlers } from './routes/handler';

const { cfg, auth } = await bootstrapServices();

const app = new Hono()
	.use('/*', getCorsConfig(cfg))
	.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw))
	.use('/*', matchHandler(getHandlers()));

export default {
	port: cfg.api.port,
	fetch: app.fetch,
};
