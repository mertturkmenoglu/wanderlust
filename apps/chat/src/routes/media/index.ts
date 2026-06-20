import { Hono } from 'hono';
import { ContainerModule } from 'inversify';
import { container } from '@/ioc';
import type { THonoContext } from '@/lib/context';
import { MediaRepository } from './repository';
import { MediaService } from './service';

export function getRouter() {
	const svc = container.get(MediaService);

	console.log('', svc == null ? '' : '')

	return new Hono<THonoContext>()
		.post('/media.createUpload', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		})
		.post('/media.completeUpload', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		})
		.get('/media.getUrl', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		});
}

export const module = new ContainerModule(({ bind }) => {
	bind(MediaService).toSelf();
	bind(MediaRepository).toSelf();
});
