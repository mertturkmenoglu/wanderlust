import { sql } from 'drizzle-orm';
import { z } from 'zod';
import { definePreparedStatement } from '@/lib/define-prepared-statement';

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

export const findManyPreferencesByUserId = definePreparedStatement({
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
