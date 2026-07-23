import { Tokens } from '@wanderlust/common';
import type { ConfigService } from '@wanderlust/config';
import type { Notifications } from '@wanderlust/contract';
import type { DatabaseService } from '@wanderlust/db';
import { sql } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { z } from 'zod';
import { definePreparedStatement } from '@/lib/define-prepared-statement';
import { os } from '../shared/router';

@injectable()
export class ListNotificationsMethod {
	constructor(
		@inject(Tokens.Database)
		private readonly db: DatabaseService,
		@inject(Tokens.Config)
		private readonly cfg: ConfigService,
	) {}

	route() {
		return os.list.handler(async ({ context }) => {
			const userId = context.session.user.id;
			const result = await this.execute(userId);

			return result;
		});
	}

	private async execute(userId: string): Promise<Notifications.dto.ListOutput> {
		const notifications = await findManyByRecipientId.execute(this.db, {
			recipientId: userId,
			limit: this.cfg.notifications.capPerUser,
		});

		return {
			notifications,
		};
	}
}

export const findManyByRecipientId = definePreparedStatement({
	schema: z.object({
		recipientId: z.string(),
		limit: z.number().int(),
	}),
	statement: (db) => {
		return db.query.notifications
			.findMany({
				where: {
					recipientId: { eq: sql.placeholder('recipientId') },
				},
				orderBy: {
					createdAt: 'desc',
				},
				limit: sql.placeholder('limit'),
			})
			.prepare('notifications_find_many_by_recipient_id');
	},
});
