import { zValidator } from '@hono/zod-validator';
import { RedisService } from '@wanderlust/cache';
import type { $dto } from '@wanderlust/common';
import { ConfigService } from '@wanderlust/config';
import { Hono } from 'hono';
import SuperJSON from 'superjson';
import z from 'zod';
import { container } from '@/ioc';
import type { THonoContext } from '@/lib/context';

type TNotification = z.infer<typeof $dto.notification>;

async function readAll(userId: string) {
	const redis = container.get(RedisService).get();
	const cfg = container.get(ConfigService).get();

	const key = `notif:list:${userId}`;

	const items = await redis.lrange(key, 0, cfg.notifications.capPerUser);

	const result = items.map((x) => SuperJSON.parse<TNotification>(x));

	return result;
}

async function setAll(userId: string, items: TNotification[]) {
	const redis = container.get(RedisService).get();
	const key = `notif:list:${userId}`;

	const serialized = items.map((item) => SuperJSON.stringify(item));
	return await redis
		.multi()
		.del(key)
		.lpush(key, ...serialized)
		.exec();
}

export const router = new Hono<THonoContext>()
	.get('/list', async (c) => {
		const userId = c.get('user').id;
		const result = await readAll(userId);
		return c.json(result);
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
			const userId = c.get('user').id;
			const { id } = c.req.valid('json');

			const items = await readAll(userId);

			const updated = items.map((item) => {
				if (item.id !== id) {
					return item;
				}

				return { ...item, readAt: new Date() };
			});

			await setAll(userId, updated);

			return c.json(
				{
					message: 'OK',
				},
				200,
			);
		},
	)
	.post('/mark-all-read', async (c) => {
		const userId = c.get('user').id;

		const items = await readAll(userId);

		const updated = items.map((item) => {
			return { ...item, readAt: new Date() };
		});

		await setAll(userId, updated);

		return c.json(
			{
				message: 'OK',
			},
			200,
		);
	})
	.delete('/clear', async (c) => {
		const userId = c.get('user').id;
		const redis = container.get(RedisService).get();
		const key = `notif:list:${userId}`;

		await redis.del(key);

		return c.json(
			{
				message: 'OK',
			},
			200,
		);
	})
	.get('/stream', async () => {});
