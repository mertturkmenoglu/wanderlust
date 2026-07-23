import { Tokens } from '@wanderlust/common';
import type { Notifications } from '@wanderlust/contract';
import type { DatabaseService } from '@wanderlust/db';
import { sql } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { z } from 'zod';
import { definePreparedStatement } from '@/lib/define-prepared-statement';
import { os } from '../shared/router';

@injectable()
export class GetNotificationPreferencesMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.preferences.handler(async ({ context }) => {
			const userId = context.session.user.id;
			const result = await this.execute(userId);

			return result;
		});
	}

	private async execute(
		userId: string,
	): Promise<Notifications.dto.PreferencesOutput> {
		const preferences = await findManyPreferencesByUserId.execute(this.db, {
			userId,
		});

		return {
			preferences,
		};
	}
}

const findManyPreferencesByUserId = definePreparedStatement({
	schema: z.object({
		userId: z.string(),
	}),
	statement: (db) => {
		return db.query.notificationPreferences
			.findMany({
				where: {
					userId: { eq: sql.placeholder('userId') },
				},
			})
			.prepare('notification_preferences_find_many_by_user_id');
	},
});
