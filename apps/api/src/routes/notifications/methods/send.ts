import { Tokens } from '@wanderlust/common';
import type { Notifications } from '@wanderlust/contract';
import type { DatabaseService } from '@wanderlust/db';
import type { JobsService } from '@wanderlust/jobs';
import { nanoid } from '@wanderlust/uid';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { isAdmin } from '@/middlewares/is-admin';
import { os } from '../internal/router';

@injectable()
export class SendNotificationMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(Tokens.Jobs) private readonly jobs: JobsService,
	) {}

	route() {
		return os.send.use(isAdmin).handler(async ({ input }) => {
			const result = await this.execute(input);

			return result;
		});
	}

	private async execute(
		data: Notifications.dto.SendInput,
	): Promise<Notifications.dto.SendOutput> {
		const recipient = await this.db.query.users.findFirst({
			where: {
				id: { eq: data.recipientId },
			},
		});

		invariant(
			recipient,
			'NOT_FOUND',
			`User with id ${data.recipientId} not found`,
		);

		await this.jobs.notifications.queue.add('create-notification', {
			id: nanoid(),
			type: 'wl_system',
			recipientId: recipient.id,
			entityId: recipient.id,
			entityType: 'user',
			readAt: null,
			createdAt: new Date(),
			data: {
				message: data.message,
			},
		});

		return {
			success: true,
		};
	}
}
