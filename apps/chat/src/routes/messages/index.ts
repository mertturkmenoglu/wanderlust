import { Hono } from 'hono';
import { ContainerModule } from 'inversify';
import { container } from '@/ioc';
import type { THonoContext } from '@/lib/context';
import { MessagesRepository } from './repository';
import { MessagesService } from './service';

export function getRouter() {
	const svc = container.get(MessagesService);

	return new Hono<THonoContext>()
		.post('/chat.messages.send', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		})
		.get('/chat.messages.list', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		})
		.get('/chat.messages.get', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		})
		.get('/chat.messages.context', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		})
		.post('/chat.messages.delete', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		})
		.post('/chat.messages.deleteForMe', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		})
		.get('/chat.messages.seenBy', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		})
		.get('/chat.messages.search', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		})
		.post('/chat.messages.update', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		});
}

export const module = new ContainerModule(({ bind }) => {
	bind(MessagesService).toSelf();
	bind(MessagesRepository).toSelf();
});
