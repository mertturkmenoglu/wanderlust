import { $includes } from '@wanderlust/db';
import { sql } from 'drizzle-orm';
import z from 'zod';
import { definePreparedStatement } from '@/lib/define-prepared-statement';

export const findFeaturedPlaces = definePreparedStatement({
	schema: z.object({}),
	statement: (db) => {
		return db.query.places
			.findMany({
				where: {
					totalVotes: { ne: 0 },
				},
				orderBy: (t, { desc }) => [
					sql`(${t.totalPoints} / ${t.totalVotes}) DESC`,
					desc(t.totalVotes),
				],
				limit: 25,
				with: $includes.place.with,
			})
			.prepare('agg_featured_places');
	},
});

export const findPopularPlaces = definePreparedStatement({
	schema: z.object({}),
	statement: (db) => {
		return db.query.places
			.findMany({
				orderBy: (t, { desc }) => [desc(t.totalVotes)],
				limit: 25,
				with: $includes.place.with,
			})
			.prepare('agg_popular_places');
	},
});

export const findNewPlaces = definePreparedStatement({
	schema: z.object({}),
	statement: (db) => {
		return db.query.places
			.findMany({
				orderBy: (t, { desc }) => [desc(t.createdAt)],
				limit: 25,
				with: $includes.place.with,
			})
			.prepare('agg_new_places');
	},
});

export const findFavoritePlaces = definePreparedStatement({
	schema: z.object({}),
	statement: (db) => {
		return db.query.places
			.findMany({
				orderBy: (t, { desc }) => [desc(t.totalFavorites)],
				limit: 25,
				with: $includes.place.with,
			})
			.prepare('agg_favorite_places');
	},
});
