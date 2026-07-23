import { Tokens } from '@wanderlust/common';
import type { Notifications } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { os } from '../shared/router';

@injectable()
export class UpdateNotificationPreferencesMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.updatePreferences.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Notifications.dto.UpdatePreferencesInput,
	): Promise<Notifications.dto.UpdatePreferencesOutput> {
		await this.db
			.insert(schema.notificationPreferences)
			.values({
				...data,
				userId: userId,
			})
			.onConflictDoUpdate({
				target: [
					schema.notificationPreferences.userId,
					schema.notificationPreferences.channel,
					schema.notificationPreferences.category,
				],
				set: {
					enabled: data.enabled,
				},
			});

		return {
			success: true,
		};
	}
}
