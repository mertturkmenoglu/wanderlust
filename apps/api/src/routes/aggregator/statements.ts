import z from 'zod';
import { definePreparedStatement } from '@/lib/define-prepared-statement';

const queryColumnsAndRelations = {
	columns: {
		id: true,
		name: true,
		rating: true,
		locality: true,
		adminAreaName: true,
		countryName: true,
	},
	with: {
		accolades: {
			columns: {
				id: true,
				title: true,
			},
		},
		assets: {
			columns: {
				url: true,
			},
			orderBy: {
				order: 'asc',
			},
			limit: 1,
		},
		primaryCategory: {
			columns: {
				displayName: true,
			},
		},
	},
} as const;

export const findFeaturedPlaces = definePreparedStatement({
	schema: z.object({}),
	statement: (db) => {
		return db.query.places
			.findMany({
				where: {
					rating: {
						ne: 0,
					},
				},
				orderBy: (t, { desc }) => [desc(t.rating), desc(t.totalVotes)],
				limit: 10,
				...queryColumnsAndRelations,
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
				limit: 10,
				...queryColumnsAndRelations,
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
				limit: 10,
				...queryColumnsAndRelations,
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
				limit: 10,
				...queryColumnsAndRelations,
			})
			.prepare('agg_favorite_places');
	},
});
