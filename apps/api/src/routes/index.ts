import type { RouterClient } from '@orpc/server';
import { getRouter as getAggregatorRouter } from './aggregator';
import { getRouter as getBookmarksRouter } from './bookmarks';
import { getRouter as getCategoriesRouter } from './categories';
import { getRouter as getCitiesRouter } from './cities';
import { getRouter as getCollectionsRouter } from './collections';
import { getRouter as getFavoritesRouter } from './favorites';
import { getRouter as getHealthRouter } from './health';
import { getRouter as getListsRouter } from './lists';
import { getRouter as getPlacesRouter } from './places';
import { getRouter as getReportsRouter } from './reports';
import { getRouter as getReviewsRouter } from './reviews';
import { getRouter as getTripsRouter } from './trips';
import { getRouter as getUsersRouter } from './users';

export function getAppRouter() {
	return {
		aggregator: getAggregatorRouter(),
		bookmarks: getBookmarksRouter(),
		categories: getCategoriesRouter(),
		cities: getCitiesRouter(),
		collections: getCollectionsRouter(),
		favorites: getFavoritesRouter(),
		health: getHealthRouter(),
		lists: getListsRouter(),
		places: getPlacesRouter(),
		reports: getReportsRouter(),
		reviews: getReviewsRouter(),
		trips: getTripsRouter(),
		users: getUsersRouter(),
	};
}

export type AppRouter = ReturnType<typeof getAppRouter>;
export type AppRouterClient = RouterClient<AppRouter>;
