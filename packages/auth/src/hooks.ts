import type { TCacheService } from '@wanderlust/cache';
import type { TDatabaseService } from '@wanderlust/db';
import * as schema from '@wanderlust/db/schema';

export async function hookAfterCreateUser(
	db: TDatabaseService,
	cache: TCacheService,
	user: { id: string; username: string },
) {
	const channels = schema.notificationChannelType.enumValues;
	const categories = schema.notificationCategoryType.enumValues;
	const preferences = channels.flatMap((ch) =>
		categories.map((c) => ({
			channel: ch,
			category: c,
			enabled: true,
			userId: user.id,
		})),
	);
	await db.insert(schema.notificationPreferences).values(preferences);
	await cache.namespace('activities').setForever({
		key: user.username as string,
		value: [],
	});
}
