import { $includes } from '@wanderlust/db';
import { sql } from 'drizzle-orm';
import z from 'zod';
import { definePreparedStatement } from '@/lib/define-prepared-statement';

export const findPlaceById = definePreparedStatement({
	schema: z.object({
		id: z.string(),
	}),
	statement: (db) => {
		return db.query.places
			.findFirst({
				where: {
					id: { eq: sql.placeholder('id') },
				},
				with: $includes.place.with,
			})
			.prepare('places_find_by_id');
	},
});

export const findFavoriteByPlaceIdAndUserId = definePreparedStatement({
	schema: z.object({
		placeId: z.string(),
		userId: z.string(),
	}),
	statement: (db) => {
		return db.query.favorites
			.findFirst({
				where: {
					placeId: { eq: sql.placeholder('placeId') },
					userId: { eq: sql.placeholder('userId') },
				},
			})
			.prepare('favorites_find_by_place_id_and_user_id');
	},
});

export const findBookmarkByPlaceIdAndUserId = definePreparedStatement({
	schema: z.object({
		placeId: z.string(),
		userId: z.string(),
	}),
	statement: (db) => {
		return db.query.bookmarks
			.findFirst({
				where: {
					placeId: { eq: sql.placeholder('placeId') },
					userId: { eq: sql.placeholder('userId') },
				},
			})
			.prepare('bookmarks_find_by_place_id_and_user_id');
	},
});
