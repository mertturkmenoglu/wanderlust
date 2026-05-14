import type { TAuthService } from '@wanderlust/auth';
import {
	type BetterAuthInstance,
	createAuthMiddleware,
} from 'evlog/better-auth';
import { createMiddleware } from 'hono/factory';

function getUserIdentifierMiddleware(auth: TAuthService) {
	return createAuthMiddleware(auth as BetterAuthInstance, {
		exclude: ['/api/auth/**'],
		maskEmail: true,
	});
}

export const evlogAuth = (auth: TAuthService) => {
	return createMiddleware(async (c, next) => {
		const identifyUser = getUserIdentifierMiddleware(auth);
		await identifyUser(c.get('log'), c.req.raw.headers, c.req.path);
		await next();
	});
};
