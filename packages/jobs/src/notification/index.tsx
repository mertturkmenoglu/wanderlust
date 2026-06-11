import type { TRedisService } from '@wanderlust/cache';
import { $insert } from '@wanderlust/common';
import type { TDatabaseService } from '@wanderlust/db';
import * as schema from '@wanderlust/db/schema';
import { Queue, Worker } from 'bullmq';
import z from 'zod';

const schemas = z.object({
	'create-notification': $insert.notification,
});

type JobName = keyof z.infer<typeof schemas>;

type Schemas = z.infer<typeof schemas>;

type DataType = Schemas[JobName];

export function initNotificationJobs(
	redis: TRedisService,
	db: TDatabaseService,
) {
	const queue = new Queue<DataType, unknown, JobName>('notification', {
		connection: redis,
	});
	const worker = new Worker<DataType, unknown, JobName>(
		'notification',
		async (job) => {
			switch (job.name) {
				case 'create-notification': {
					const data = job.data;
					await db.insert(schema.notifications).values({
						...data,
						createdAt: undefined,
					});

					break;
				}
			}
		},
		{ connection: redis },
	);

	return {
		queue,
		worker,
	};
}
