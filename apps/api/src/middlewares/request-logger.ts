import type { MiddlewareHandler } from 'hono';
import { logger } from '../lib/logger';

export const requestLogger: MiddlewareHandler = async (c, next) => {
	const start = Date.now();
	await next();

	if (c.req.method === 'OPTIONS') {
		return;
	}

	logger.info('request', {
		method: c.req.method,
		path: c.req.path,
		status: c.res.status,
		ms: Date.now() - start,
	});
};
