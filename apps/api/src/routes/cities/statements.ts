import { sql } from 'drizzle-orm';
import { z } from 'zod';
import { definePreparedStatement } from '@/lib/define-prepared-statement';

export const findMany = definePreparedStatement({
	schema: z.object({}),
	statement: (db) => {
		return db.query.cities
			.findMany({
				orderBy: {
					name: 'asc',
				},
			})
			.prepare('cities_find_many');
	},
});

export const findById = definePreparedStatement({
	schema: z.object({
		id: z.string(),
	}),
	statement: (db) => {
		return db.query.cities
			.findFirst({
				where: {
					id: { eq: sql.placeholder('id') },
				},
			})
			.prepare('cities_find_by_id');
	},
});
