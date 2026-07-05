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
