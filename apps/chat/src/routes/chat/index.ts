import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ContainerModule } from 'inversify';
import z from 'zod';
import { container } from '@/ioc';
import type { THonoContext } from '@/lib/context';
import { ChatRepository } from './repository';
import { ChatService } from './service';

export function getRouter() {
	const svc = container.get(ChatService);

	return new Hono<THonoContext>()
		.post('/chat.create', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		})
		.post('/chat.open', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		})
		.get(
			'/chat.info',
			zValidator(
				'query',
				z.object({
					q: z.string(),
				}),
			),
			async (c) => {
				return c.json(
					{
						message: 'Not implemented',
					},
					501,
				);
			},
		)
		.get(
			'/chat.list',
			zValidator(
				'json',
				z.object({
					id: z.string(),
				}),
			),
			async (c) => {
				return c.json({
					items: ['alice', 'barbara', 'charlie', 'diana'],
				});
			},
		)
		.post('/chat.update', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		})
		.post('/chat.leave', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		})
		.post('/chat.clear', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		})
		.post('/chat.markRead', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		})
		.post('/chat.pin', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		})
		.post('/chat.unpin', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		})
		.get('/chat.unread', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		})
		.post('/chat.mute', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		})
		.post('/chat.unmute', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		})
		.post('/chat.delete', async (c) => {
			return c.json(
				{
					message: 'Not implemented',
				},
				501,
			);
		});
}

export const module = new ContainerModule(({ bind }) => {
	bind(ChatService).toSelf();
	bind(ChatRepository).toSelf();
});
