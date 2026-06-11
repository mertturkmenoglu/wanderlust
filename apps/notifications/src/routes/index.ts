import { zValidator } from '@hono/zod-validator';
import { RedisService } from '@wanderlust/cache';
import { $dto } from '@wanderlust/common';
import { ConfigService } from '@wanderlust/config';
import { Hono } from 'hono';
import z from 'zod';
import { container } from '@/ioc';
import type { THonoContext } from '@/lib/context';

export const router = new Hono<THonoContext>()
	.get('/list', async (c) => {
		const redis = container.get(RedisService).get();
		const cfg = container.get(ConfigService).get();

		const userId = c.get('user').id;
		const key = `notif:list:${userId}`;

		const items = await redis.lrange(key, 0, cfg.notifications.capPerUser);

		const result = $dto.notification.array().safeParse(items);

		if (!result.success) {
			return c.json({ error: result.error }, 500);
		}

		return c.json(result.data);
	})
	.post(
		'/mark-read',
		zValidator(
			'json',
			z.object({
				id: z.string(),
			}),
		),
		async (c) => {
			const redis = container.get(RedisService).get();
			const userId = c.get('user').id;
			const { id } = c.req.valid('json');

			const key = `notif:list:${userId}`;
			const items = await redis.lrange(key, 0, -1);

			const result = $dto.notification.array().safeParse(items);

			if (!result.success) {
				return c.json({ error: result.error }, 500);
			}

			const updated = result.data.map((item) => {
				if (item.id !== id) {
					return item;
				}

				return { ...item, readAt: new Date() };
			});

			const serialized = updated.map((item) => JSON.stringify(item));

			await redis
				.multi()
				.del(key)
				.lpush(key, ...serialized)
				.exec();

			return c.json(
				{
					message: 'OK',
				},
				200,
			);
		},
	)
	.post('/mark-all-read', async (c) => {
		const redis = container.get(RedisService).get();
		const userId = c.get('user').id;

		const key = `notif:list:${userId}`;
		const items = await redis.lrange(key, 0, -1);

		const result = $dto.notification.array().safeParse(items);

		if (!result.success) {
			return c.json({ error: result.error }, 500);
		}

		const updated = result.data.map((item) => {
			return { ...item, readAt: new Date() };
		});

		const serialized = updated.map((item) => JSON.stringify(item));

		await redis
			.multi()
			.del(key)
			.lpush(key, ...serialized)
			.exec();

		return c.json(
			{
				message: 'OK',
			},
			200,
		);
	})
	.get('/stream', async (c) => {});
