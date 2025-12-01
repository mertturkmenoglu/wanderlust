import { Queue, Worker } from 'bullmq';
import z from 'zod';
import { ConfigProvider } from '@/lib/config';
import type { Container } from '@/lib/di';
import { EmailProvider, subjects, templates } from '@/lib/email';

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

export function initJobs(ioc: Container) {
	const cfg = ioc.resolve(ConfigProvider.id);
	const email = ioc.resolve(EmailProvider.id);

	const queue = new Queue<DataType, unknown, JobName>('email');
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
	);

	return {
		queue,
		worker,
	};
}
