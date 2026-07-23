import { render } from '@react-email/components';
import {
	ForgotPasswordEmail,
	TestEmail,
	WelcomeEmail,
} from '@wanderlust/email';
import z from 'zod';
import { defineQueue } from '@/internal/queue-builder';
import type { Dependencies } from '@/internal/types';

export function defineEmailJobs(deps: Dependencies) {
	return defineQueue(deps, {
		name: 'emails',
		schemas: z.object({
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
		}),
		processors: {
			test: async (data, ctx) => {
				const html = await render(<TestEmail message={data.message} />);

				await ctx.email.sendMail({
					from: ctx.config.email.from,
					to: data.email,
					subject: 'Test Email',
					html: html,
				});
			},
			'password-reset': async (data, ctx) => {
				const html = await render(
					<ForgotPasswordEmail
						firstName={data.firstName}
						resetPasswordUrl={data.url}
					/>,
				);

				await ctx.email.sendMail({
					from: ctx.config.email.from,
					to: data.email,
					subject: 'Reset Your Password',
					html: html,
				});
			},
			welcome: async (data, ctx) => {
				const html = await render(<WelcomeEmail firstName={data.name} />);
				await ctx.email.sendMail({
					from: ctx.config.email.from,
					to: data.email,
					subject: 'Welcome to Wanderlust!',
					html: html,
				});
			},
		},
		queueOptions: {
			connection: deps.redis.options,
		},
		workerOptions: {
			connection: deps.redis.options,
			name: 'email-worker',
			concurrency: 5,
		},
	}).build();
}
