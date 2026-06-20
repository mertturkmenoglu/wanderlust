import { Hono } from 'hono';
import { ContainerModule } from 'inversify';
import { container } from '@/ioc';
import type { THonoContext } from '@/lib/context';
import { ReactionsRepository } from './repository';
import { ReactionsService } from './service';

export function getRouter() {
	const svc = container.get(ReactionsService);

	console.log('', svc == null ? '' : '')

	return new Hono<THonoContext>()
		.post('/chat.reactions.add', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		})
		.post('/chat.reactions.remove', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		})
		.get('/chat.reactions.list', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		});
}

export const module = new ContainerModule(({ bind }) => {
	bind(ReactionsService).toSelf();
	bind(ReactionsRepository).toSelf();
});
