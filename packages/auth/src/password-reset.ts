import type { TJobsService } from '@wanderlust/jobs';
import type { User } from 'better-auth';

export async function sendResetPassword(
	data: { user: User; url: string; token: string },
	jobs: TJobsService,
): Promise<void> {
	await jobs.email.queue.add('password-reset', {
		firstName: data.user.name,
		email: data.user.email,
		url: data.url,
	});
}
