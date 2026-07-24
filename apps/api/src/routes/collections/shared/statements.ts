import { $includes } from '@wanderlust/db';
import { sql } from 'drizzle-orm';
import z from 'zod';
import { definePreparedStatement } from '@/lib/define-prepared-statement';

export const findManyByCityId = definePreparedStatement({
	schema: z.object({
		id: z.int(),
	}),
	statement: (db) => {
		return db.query.collectionsCities
			.findMany({
				where: {
					cityId: { eq: sql.placeholder('id') },
				},
				orderBy: {
					index: 'asc',
				},
				with: {
					collection: {
						with: {
							items: {
								orderBy: {
									index: 'asc',
								},
								with: {
									place: $includes.place,
								},
							},
						},
					},
				},
			})
			.prepare('collections_find_many_by_city_id');
	},
});

export const findLastIndexOfCollection = definePreparedStatement({
	schema: z.object({
		collectionId: z.int(),
	}),
	statement: (db) => {
		return db.query.collectionsCities
			.findFirst({
				where: {
					collectionId: { eq: sql.placeholder('collectionId') },
				},
				columns: {
					index: true,
				},
				orderBy: {
					index: 'desc',
				},
			})
			.prepare('collections_find_last_index_of_collection');
	},
});
