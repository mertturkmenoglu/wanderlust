import type { TRedisService } from '@wanderlust/cache';
import { $insert } from '@wanderlust/common';
import type { TConfigService } from '@wanderlust/config';
import { Queue, Worker } from 'bullmq';
import SuperJSON from 'superjson';
import z from 'zod';

const schemas = z.object({
	'create-notification': $insert.notification,
});

type JobName = keyof z.infer<typeof schemas>;

type Schemas = z.infer<typeof schemas>;

type DataType = Schemas[JobName];

export function initNotificationJobs(
	cfg: TConfigService,
	redis: TRedisService,
) {
	const queue = new Queue<DataType, unknown, JobName>('email', {
		connection: redis,
	});
	const worker = new Worker<DataType, unknown, JobName>(
		'email',
		async (job) => {
			switch (job.name) {
				case 'create-notification': {
					const data = job.data as Schemas['create-notification'];
					const key = `notif:list:${data.recipientId}`;
					const serialized = SuperJSON.stringify(data);
					await redis
						.multi()
						.lpush(key, serialized)
						.ltrim(key, 0, cfg.notifications.capPerUser - 1)
						.exec();

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
