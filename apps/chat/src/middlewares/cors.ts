import { ConfigService } from '@wanderlust/config';
import { cors } from 'hono/cors';
import { createMiddleware } from 'hono/factory';
import { container } from '@/ioc';
import type { THonoContext } from '@/lib/context';

export const useCors = createMiddleware<THonoContext>((c, next) => {
	const cfg = container.get(ConfigService).get();

	const mwHandler = cors({
		origin: cfg.notifications.cors.allowedOrigins,
		allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		allowHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	});

	return mwHandler(c, next);
});
