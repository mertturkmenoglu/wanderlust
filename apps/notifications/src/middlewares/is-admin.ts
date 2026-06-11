import { createMiddleware } from 'hono/factory';
import type { THonoContext } from '@/lib/context';

export const isAdmin = createMiddleware<THonoContext>(async (c, next) => {
	const user = c.get('user');

	if (user.role !== 'admin') {
		return c.json(
			{
				message: 'Forbidden',
			},
			401,
		);
	}

	await next();
});
