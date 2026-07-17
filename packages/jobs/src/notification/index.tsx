import type { TRedisService } from '@wanderlust/cache';
import { Types } from '@wanderlust/common';
import type { TDatabaseService } from '@wanderlust/db';
import { schema } from '@wanderlust/db';
import { Queue, Worker } from 'bullmq';
import z from 'zod';

const schemas = z.object({
	'create-notification': Types.Notifications.$Insert.Notification,
});

type JobName = keyof z.infer<typeof schemas>;

type Schemas = z.infer<typeof schemas>;

type DataType = Schemas[JobName];

export function initNotificationJobs(
	redis: TRedisService,
	db: TDatabaseService,
) {
	const queue = new Queue<DataType, unknown, JobName>('notification', {
		connection: redis.options,
		defaultJobOptions: {
			attempts: 3,
			backoff: {
				type: 'exponential',
				delay: 1000,
			},
		},
	});
	const worker = new Worker<DataType, unknown, JobName>(
		'notification',
		async (job) => {
			switch (job.name) {
				case 'create-notification': {
					const data = job.data;
					await db.insert(schema.notifications).values({
						entityId: data.entityId,
						entityType: data.entityType,
						id: data.id,
						recipientId: data.recipientId,
						type: data.type,
						data: JSON.parse(JSON.stringify(data.data)),
						createdAt: new Date(),
					});

					break;
				}
			}
		},
		{ connection: redis.options, name: 'notification-worker', concurrency: 5 },
	);

	return {
		queue,
		worker,
	};
}
