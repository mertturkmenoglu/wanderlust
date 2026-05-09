import { Queue, Worker } from 'bullmq';
import type { Container } from 'inversify';
import IORedis from 'ioredis';
import z from 'zod';
import { ConfigService } from '@/lib/config';
import { EmailService, subjects, templates } from '@/lib/email';

const schemas = z.object({
	'emails/password-reset': z.object({
		email: z.email(),
		url: z.url(),
	}),
	'emails/welcome': z.object({
		email: z.email(),
		name: z.string(),
	}),
});

type JobName = keyof z.infer<typeof schemas>;

type Schemas = z.infer<typeof schemas>;

type DataType = Schemas[JobName];

export function initJobs(container: Container) {
	const cfg = container.get(ConfigService).get();
	const email = container.get(EmailService).get();

	const connection = new IORedis({
		host: cfg.redis.host,
		port: cfg.redis.port,
		db: cfg.redis.db,
		maxRetriesPerRequest: null,
	});

	const queue = new Queue<DataType, unknown, JobName>('email', { connection });
	const worker = new Worker<DataType, unknown, JobName>(
		'email',
		async (job) => {
			switch (job.name) {
				case 'emails/password-reset': {
					const data = job.data as Schemas['emails/password-reset'];
					await email.sendMail({
						from: cfg.email.from,
						to: data.email,
						subject: subjects.passwordReset,
						html: templates.forgotPassword({
							url: data.url,
						}),
					});
					break;
				}
				case 'emails/welcome': {
					const data = job.data as Schemas['emails/welcome'];
					await email.sendMail({
						from: cfg.email.from,
						to: data.email,
						subject: subjects.welcome,
						html: templates.welcome({
							name: data.name,
						}),
					});
					break;
				}
			}
		},
		{ connection },
	);

	return {
		queue,
		worker,
	};
}
