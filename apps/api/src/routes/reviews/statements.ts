import { schema } from '@wanderlust/db';
import { and, count, eq, gte, lte, sql } from 'drizzle-orm';
import z from 'zod';
import { definePreparedStatement } from '@/lib/define-prepared-statement';

export const countByPlaceId = definePreparedStatement({
	schema: z.object({
		placeId: z.string(),
		minRating: z.int(),
		maxRating: z.int(),
	}),
	statement: (db) => {
		return db
			.select({ count: count() })
			.from(schema.reviews)
			.where(
				and(
					eq(schema.reviews.placeId, sql.placeholder('placeId')),
					gte(schema.reviews.rating, sql.placeholder('minRating')),
					lte(schema.reviews.rating, sql.placeholder('maxRating')),
				),
			)
			.prepare('reviews_count_by_place_id');
	},
});
