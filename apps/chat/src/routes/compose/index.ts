import { Hono } from 'hono';
import { ContainerModule } from 'inversify';
import { container } from '@/ioc';
import type { THonoContext } from '@/lib/context';
import { ComposeService } from './service';

export function getRouter() {
	const svc = container.get(ComposeService);

	console.log('', svc == null ? '' : '')

	return new Hono<THonoContext>()
		.get('/links.unfurl', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		})
		.get('/gifs.search', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		})
		.get('/stickers.list', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		});
}

export const module = new ContainerModule(({ bind }) => {
	bind(ComposeService).toSelf();
});
