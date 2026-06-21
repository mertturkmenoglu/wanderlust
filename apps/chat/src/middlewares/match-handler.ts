import { createMiddleware } from 'hono/factory';
import type { getHandlers } from '@/routes/handler';

export const matchHandler = ({ api, rpc }: ReturnType<typeof getHandlers>) => {
	return createMiddleware(async (c, next) => {
		const isRpcRequest = c.req.path.startsWith('/rpc');
		const handler = isRpcRequest ? rpc : api;

		const res = await handler.handle(c.req.raw, {
			prefix: isRpcRequest ? '/rpc' : '/api',
			// @ts-expect-error Context type inference
			context: await createContext({ context: c, container }),
		});

		if (res.matched) {
			return c.newResponse(res.response.body, res.response);
		}

		await next();
	});
};
