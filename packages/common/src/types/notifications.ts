import { schema } from '@wanderlust/db';
import { createInsertSchema, createSelectSchema } from 'drizzle-orm/zod';
import { z } from 'zod';
import { Resources } from './resources';
import { Timestamp } from './timestamp';

export const Notification = createSelectSchema(schema.notifications, {
	id: Resources.id,
	recipientId: Resources.id,
	type: z.enum(schema.notificationType.enumValues).meta({
		description: 'Notification type',
	}),
	entityType: z.enum(schema.notificationEntityType.enumValues).meta({
		description: 'Entity type',
		examples: ['place', 'trip', 'user'],
	}),
	entityId: Resources.id,
	data: z.record(z.string(), z.any()).nullable().meta({
		description: 'Notification data',
	}),
	readAt: Timestamp.nullable(),
	createdAt: Timestamp,
}).meta({
	description: 'A notification entity',
});

export namespace Notifications {
	export const Preference = createSelectSchema(schema.notificationPreferences, {
		userId: Resources.id,
		category: z.enum(schema.notificationCategoryType.enumValues),
		channel: z.enum(schema.notificationChannelType.enumValues),
		enabled: z.boolean().meta({
			description: 'Whether this preference is enabled or not',
			examples: [true, false],
		}),
	}).meta({
		description: 'A notification preference of a user',
	});

	export namespace $Insert {
		export const Notification = createInsertSchema(schema.notifications);

		export const Preference = createInsertSchema(
			schema.notificationPreferences,
		);
	}
}
