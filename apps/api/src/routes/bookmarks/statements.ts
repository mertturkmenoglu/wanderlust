import { $includes } from '@wanderlust/db';
import { sql } from 'drizzle-orm';
import { z } from 'zod';
import { definePreparedStatement } from '@/lib/define-prepared-statement';

export const findMany = definePreparedStatement({
	schema: z.object({
		userId: z.string(),
		offset: z.int(),
		limit: z.int(),
	}),
	statement: (db) => {
		return db.query.bookmarks
			.findMany({
				where: {
					userId: sql.placeholder('userId'),
				},
				orderBy: {
					createdAt: 'desc',
				},
				offset: sql.placeholder('offset'),
				limit: sql.placeholder('limit'),
				with: {
					place: $includes.place,
				},
			})
			.prepare('bookmarks_find_many');
	},
});
