import { sql } from 'drizzle-orm';
import z from 'zod';
import { definePreparedStatement } from '@/lib/define-prepared-statement';

export const findAssignments = definePreparedStatement({
	schema: z.object({
		id: z.string(),
	}),
	statement: (db) => {
		return db.query.accoladeAssignments
			.findMany({
				where: {
					accoladeId: sql.placeholder('id'),
				},
			})
			.prepare('accolades_find_assignments');
	},
});

export const findMany = definePreparedStatement({
	schema: z.object({
		offset: z.int(),
		limit: z.int(),
	}),
	statement: (db) => {
		return db.query.accolades
			.findMany({
				orderBy: {
					title: 'asc',
					createdAt: 'asc',
				},
				offset: sql.placeholder('offset'),
				limit: sql.placeholder('limit'),
			})
			.prepare('accolades_find_many');
	},
});

