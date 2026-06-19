import 'reflect-metadata';

import { ConfigService } from '@wanderlust/config';
import { evlog } from 'evlog/hono';
import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { bootstrapServices, container } from './ioc';
import type { THonoContext } from './lib/context';
import { isAuth } from './middlewares/authn';
import { useCors } from './middlewares/cors';
import { routes } from './routes';

await bootstrapServices();

const cfg = container.get(ConfigService).get();

const app = new Hono<THonoContext>()
	.use(evlog())
	.use('/*', useCors)
	.use(compress())
	.use('*', isAuth)
	.route('/', routes.chat.getRouter())
	.route('/', routes.compose.getRouter())
	.route('/', routes.media.getRouter())
	.route('/', routes.members.getRouter())
	.route('/', routes.messages.getRouter())
	.route('/', routes.reactions.getRouter())
	.route('/', routes.realtime.getRouter());

export default {
	port: cfg.chat.port,
	fetch: app.fetch,
};

export type ChatAppType = typeof app;

