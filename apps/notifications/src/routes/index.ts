import { zValidator } from '@hono/zod-validator';
import { RedisService } from '@wanderlust/cache';
import type { $dto } from '@wanderlust/common';
import { ConfigService } from '@wanderlust/config';
import { JobsService } from '@wanderlust/jobs';
import { nanoid } from '@wanderlust/uid';
import { Hono } from 'hono';
import SuperJSON from 'superjson';
import z from 'zod';
import { container } from '@/ioc';
import type { THonoContext } from '@/lib/context';
import { isAdmin } from '@/middlewares/is-admin';

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
	.post(
		'/create-dummy',
		isAdmin,
		zValidator(
			'json',
			z.object({
				userId: z.string().min(1),
			}),
		),
		async (c) => {
			const { userId } = c.req.valid('json');
			const jobs = container.get(JobsService).get();

			await jobs.notification.queue.add('create-notification', {
				actorId: null,
				createdAt: new Date(),
				data: {
					message: 'This is a test message from the server',
				},
				entityId: userId,
				entityType: 'user',
				id: nanoid(),
				readAt: null,
				recipientId: userId,
				type: 'wl_system',
			});

			return c.json(
				{
					message: 'Created',
				},
				201,
			);
		},
	)
	.get('/stream', async () => {});
