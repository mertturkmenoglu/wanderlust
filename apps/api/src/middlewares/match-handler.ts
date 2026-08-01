import type { AuthService } from '@wanderlust/auth';
import { Tokens } from '@wanderlust/common';
import { createMiddleware } from 'hono/factory';
import { createContext } from '@/lib/context';
import type { getHandlers } from '@/routes/handler';
import { container } from '../ioc';

export const matchHandler = ({ api, rpc }: ReturnType<typeof getHandlers>) => {
	const authService = container.get<AuthService>(Tokens.Auth);

	return createMiddleware(async (c, next) => {
		const isRpcRequest = c.req.path.startsWith('/rpc');
		const handler = isRpcRequest ? rpc : api;

		const res = await handler.handle(c.req.raw, {
			prefix: isRpcRequest ? '/rpc' : '/api',
			// @ts-expect-error Context inference
			context: await createContext({ context: c, auth: authService }),
		});

		if (res.matched) {
			return c.newResponse(res.response.body, res.response);
		}

		await next();
	});
};
