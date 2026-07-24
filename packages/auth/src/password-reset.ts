import type { JobsService } from '@wanderlust/jobs';
import type { User } from 'better-auth';

export async function sendResetPassword(
	data: { user: User; url: string; token: string },
	jobs: JobsService,
): Promise<void> {
	await jobs.emails.queue.add('password-reset', {
		firstName: data.user.name,
		email: data.user.email,
		url: data.url,
	});
}

export async function sendPasswordChangeInfoEmail(
	data: { user: User },
	jobs: JobsService,
): Promise<void> {
	await jobs.emails.queue.add('password-change-info', {
		email: data.user.email,
		firstName: data.user.name,
	});
}
