import { sql } from 'drizzle-orm';
import z from 'zod';
import { definePreparedStatement } from '@/lib/define-prepared-statement';

export const findByUserId = definePreparedStatement({
	schema: z.object({
		userId: z.string(),
	}),
	statement: (db) => {
		return db.query.preferences
			.findFirst({
				where: {
					userId: { eq: sql.placeholder('userId') },
				},
			})
			.prepare('preferences_find_by_user_id');
	},
});
