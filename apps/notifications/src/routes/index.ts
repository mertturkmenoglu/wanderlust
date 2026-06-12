import { zValidator } from '@hono/zod-validator';
import { $insert } from '@wanderlust/common';
import { ConfigService } from '@wanderlust/config';
import { DatabaseService } from '@wanderlust/db';
import * as schema from '@wanderlust/db/schema';
import { JobsService } from '@wanderlust/jobs';
import { nanoid } from '@wanderlust/uid';
import { and, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import z from 'zod';
import { container } from '@/ioc';
import type { THonoContext } from '@/lib/context';
import { isAdmin } from '@/middlewares/is-admin';

export const router = new Hono<THonoContext>()
	.get('/list', async (c) => {
		const cfg = container.get(ConfigService).get();
		const db = container.get(DatabaseService).get();

		const userId = c.get('user').id;

		const result = await db.query.notifications.findMany({
			where: (t, { eq }) => eq(t.recipientId, userId),
			orderBy: (t, { desc }) => desc(t.createdAt),
			limit: cfg.notifications.capPerUser,
		});

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
			const db = container.get(DatabaseService).get();
			const userId = c.get('user').id;
			const { id } = c.req.valid('json');

			await db
				.update(schema.notifications)
				.set({
					readAt: new Date(),
				})
				.where(
					and(
						eq(schema.notifications.id, id),
						eq(schema.notifications.recipientId, userId),
					),
				);

			return c.json(
				{
					message: 'OK',
				},
				200,
			);
		},
	)
	.post('/mark-all-read', async (c) => {
		const db = container.get(DatabaseService).get();
		const userId = c.get('user').id;

		await db
			.update(schema.notifications)
			.set({
				readAt: new Date(),
			})
			.where(eq(schema.notifications.recipientId, userId));

		return c.json(
			{
				message: 'OK',
			},
			200,
		);
	})
	.delete('/clear', async (c) => {
		const db = container.get(DatabaseService).get();
		const userId = c.get('user').id;

		await db
			.delete(schema.notifications)
			.where(eq(schema.notifications.recipientId, userId));

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
	.get('/preferences', async (c) => {
		const user = c.get('user');
		const db = container.get(DatabaseService).get();

		const preferences = await db.query.notificationPreferences.findMany({
			where: (t, { eq }) => eq(t.userId, user.id),
		});

		return c.json({
			preferences,
		});
	})
	.patch(
		'/preferences',
		zValidator('json', $insert.notificationPreference),
		async (c) => {
			const userId = c.get('user').id;
			const body = c.req.valid('json');

			const db = container.get(DatabaseService).get();

			await db
				.insert(schema.notificationPreferences)
				.values({
					...body,
					userId,
				})
				.onConflictDoUpdate({
					target: [
						schema.notificationPreferences.userId,
						schema.notificationPreferences.channel,
						schema.notificationPreferences.category,
					],
					set: {
						enabled: body.enabled,
					},
				});

			return c.json(
				{
					message: 'OK',
				},
				201,
			);
		},
	)
	.get('/stream', async () => {});
