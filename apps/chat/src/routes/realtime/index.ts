import { Hono } from 'hono';
import { ContainerModule } from 'inversify';
import type { THonoContext } from '@/lib/context';

export function getRouter() {
	return new Hono<THonoContext>().get('/realtime.connect', async (c) => {
		return c.json(
			{
				message: 'Not implemented',
			},
			501,
		);
	});
}

export const module = new ContainerModule(() => { });
