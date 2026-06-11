import { AuthService } from '@wanderlust/auth';
import { createMiddleware } from 'hono/factory';
import { container } from '@/ioc';
import type { THonoContext } from '@/lib/context';

export const isAuth = createMiddleware<THonoContext>(async (c, next) => {
	const auth = container.get(AuthService).get();

	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (!session) {
		return c.json({ message: 'Unauthorized' }, 401);
	}

	c.set('user', session.user);
	c.set('session', session.session);
	await next();
});
