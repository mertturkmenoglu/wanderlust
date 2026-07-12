import * as p from 'drizzle-orm/pg-core';
import { users } from './auth';

export const notificationType = p.pgEnum('notification_type', [
	'user_follow',
	'trip_add_user',
	'trip_update',
	'trip_invite',
	'trip_add_comment',
	'mention',
	'wl_event_suggest',
	'wl_list_suggest',
	'wl_system',
]);

export const notificationEntityType = p.pgEnum('notification_entity_type', [
	'place',
	'review',
	'event',
	'list',
	'trip',
	'user',
]);

export const notifications = p.pgTable(
	'notifications',
	{
		id: p.text().notNull().primaryKey(),
		recipientId: p
			.text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: notificationType().notNull(),
		entityType: notificationEntityType().notNull(),
		entityId: p.text().notNull(),
		// biome-ignore lint/suspicious/noExplicitAny: any is ok here
		data: p.jsonb().$type<Record<string, any>>(),
		readAt: p.timestamp({ withTimezone: true }),
		createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(t) => [p.index().on(t.recipientId), p.index().on(t.createdAt)],
);

export const notificationChannelType = p.pgEnum('notification_channel_type', [
	'email',
	'in_app',
]);

export const notificationCategoryType = p.pgEnum('notification_category_type', [
	'digest',
	'recommendation',
	'anniversary',
	'upcoming-trips',
]);

export const notificationPreferences = p.pgTable(
	'notification_preferences',
	{
		userId: p
			.text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		channel: notificationChannelType().notNull(),
		category: notificationCategoryType().notNull(),
		enabled: p.boolean().notNull(),
	},
	(t) => [p.primaryKey({ columns: [t.userId, t.channel, t.category] })],
);
