import type { MiddlewareHandler } from 'hono';
import { requestLogger as logger } from '../lib/logger';

export const requestLogger: MiddlewareHandler = async (c, next) => {
	const start = Date.now();
	await next();

	if (c.req.method === 'OPTIONS') {
		return;
	}

	const level =
		c.res.status >= 500 ? 'error' : c.res.status >= 400 ? 'warn' : 'info';

	logger.log(
		level,
		`${c.req.method} ${new URL(c.req.url).pathname} ${c.res.status} - ${Date.now() - start}ms`,
	);
};
