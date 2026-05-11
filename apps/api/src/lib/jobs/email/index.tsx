import { render } from '@react-email/components';
import Email from '@wanderlust/email/email';
import ForgotPasswordEmail from '@wanderlust/email/forgot-password';
import WelcomeEmail from '@wanderlust/email/welcome';
import { Queue, Worker } from 'bullmq';
import type { Container } from 'inversify';
import IORedis from 'ioredis';
import z from 'zod';
import { ConfigService } from '@/lib/config';
import { EmailService } from '@/lib/email';

const schemas = z.object({
	test: z.object({
		email: z.email(),
		message: z.string(),
	}),
	'password-reset': z.object({
		firstName: z.string(),
		email: z.email(),
		url: z.url(),
	}),
	welcome: z.object({
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
				case 'test': {
					const data = job.data as Schemas['test'];
					const html = await render(<Email message={data.message} />);

					await email.sendMail({
						from: cfg.email.from,
						to: data.email,
						subject: 'Test Email',
						html: html,
					});
					break;
				}
				case 'password-reset': {
					const data = job.data as Schemas['password-reset'];
					const html = await render(
						<ForgotPasswordEmail
							firstName={data.firstName}
							resetPasswordUrl={data.url}
						/>,
					);

					await email.sendMail({
						from: cfg.email.from,
						to: data.email,
						subject: 'Reset Your Password',
						html: html,
					});
					break;
				}
				case 'welcome': {
					const data = job.data as Schemas['welcome'];
					const html = await render(<WelcomeEmail firstName={data.name} />);
					await email.sendMail({
						from: cfg.email.from,
						to: data.email,
						subject: 'Welcome to Wanderlust!',
						html: html,
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
