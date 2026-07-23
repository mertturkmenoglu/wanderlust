import { Tokens } from '@wanderlust/common';
import type { Notifications } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { and, eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { os } from '../shared/router';

@injectable()
export class MarkNotificationReadMethod {
	constructor(
		@inject(Tokens.Database)
		private readonly db: DatabaseService,
	) {}

	route() {
		return os.markRead.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Notifications.dto.MarkReadInput,
	): Promise<Notifications.dto.MarkReadOutput> {
		const result = await this.db
			.update(schema.notifications)
			.set({
				readAt: new Date(),
			})
			.where(
				and(
					eq(schema.notifications.id, data.id),
					eq(schema.notifications.recipientId, userId),
				),
			);

		invariant(result.rowCount === 1, 'NOT_FOUND', 'Notification not found');

		return {
			success: true,
		};
	}
}
