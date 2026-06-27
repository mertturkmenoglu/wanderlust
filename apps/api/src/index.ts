import 'reflect-metadata';

import { type EvlogVariables, evlog } from 'evlog/hono';
import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { bootstrapServices } from './bootstrap';
import { getCorsConfig } from './middlewares/cors';
import { matchHandler } from './middlewares/match-handler';
import { getHandlers } from './routes/handler';

const { cfg, auth } = await bootstrapServices();

const app = new Hono<EvlogVariables>()
	.use(evlog())
	.use('/*', getCorsConfig(cfg))
	.use(compress())
	.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw))
	.use('/*', matchHandler(getHandlers()));

export default {
	port: cfg.api.port,
	fetch: app.fetch,
};
