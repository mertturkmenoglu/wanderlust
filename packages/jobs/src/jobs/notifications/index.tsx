import { Types } from '@wanderlust/common';
import { schema } from '@wanderlust/db';
import z from 'zod';
import { defineQueue } from '@/internal/queue-builder';
import type { Dependencies } from '@/internal/types';

export function defineNotificationsJobs(deps: Dependencies) {
	return defineQueue(deps, {
		name: 'notifications',
		schemas: z.object({
			'create-notification': Types.Notifications.$Insert.Notification,
		}),
		processors: {
			'create-notification': async (data, ctx) => {
				await ctx.db.insert(schema.notifications).values({
					entityId: data.entityId,
					entityType: data.entityType,
					id: data.id,
					recipientId: data.recipientId,
					type: data.type,
					data: JSON.parse(JSON.stringify(data.data)),
					createdAt: new Date(),
				});
			},
		},
		queueOptions: {
			connection: deps.redis.options,
			defaultJobOptions: {
				attempts: 3,
				backoff: {
					type: 'exponential',
					delay: 1000,
				},
			},
		},
		workerOptions: {
			connection: deps.redis.options,
			name: 'notification-worker',
			concurrency: 5,
		},
	}).build();
}
