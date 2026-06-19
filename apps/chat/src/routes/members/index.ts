import { Hono } from 'hono';
import { ContainerModule } from 'inversify';
import { container } from '@/ioc';
import type { THonoContext } from '@/lib/context';
import { MembersRepository } from './repository';
import { MembersService } from './service';

export function getRouter() {
	const svc = container.get(MembersService);

	return new Hono<THonoContext>()
		.post('/chat.members.list', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		})
		.post('/chat.members.add', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		})
		.post('/chat.members.remove', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		})
		.post('/chat.members.setRole', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		});
}

export const module = new ContainerModule(({ bind }) => {
	bind(MembersService).toSelf();
	bind(MembersRepository).toSelf();
});
