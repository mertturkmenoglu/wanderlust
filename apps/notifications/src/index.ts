import 'reflect-metadata';

import { ConfigService } from '@wanderlust/config';
import { evlog } from 'evlog/hono';
import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { bootstrapServices, container } from './ioc';
import type { THonoContext } from './lib/context';
import { isAuth } from './middlewares/authn';
import { useCors } from './middlewares/cors';
import { router } from './routes';

await bootstrapServices();

const cfg = container.get(ConfigService).get();

const app = new Hono<THonoContext>()
	.use(evlog())
	.use('/*', useCors)
	.use(compress())
	.use('*', isAuth)
	.route('/', router);

export default {
	port: cfg.notifications.port,
	fetch: app.fetch,
};

export type NotificationsAppType = typeof app;
