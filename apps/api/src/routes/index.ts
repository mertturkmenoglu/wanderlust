import type { RouterClient } from '@orpc/server';
import { getRouter as getAggregatorRouter } from './aggregator';
import { getRouter as getAmenitiesRouter } from './amenities';
import { getRouter as getBookmarksRouter } from './bookmarks';
import { getRouter as getCategoriesRouter } from './categories';
import { getRouter as getCitiesRouter } from './cities';
import { getRouter as getCollectionsRouter } from './collections';
import { getRouter as getEventsRouter } from './events';
import { getRouter as getFavoritesRouter } from './favorites';
import { getRouter as getHealthRouter } from './health';
import { getRouter as getListsRouter } from './lists';
import { getRouter as getPlacesRouter } from './places';
import { getRouter as getReportsRouter } from './reports';
import { getRouter as getReviewsRouter } from './reviews';
import { getRouter as getTripsRouter } from './trips';
import { getRouter as getUsersRouter } from './users';

type AppRouterShape = {
	aggregator: ReturnType<typeof getAggregatorRouter>;
	amenities: ReturnType<typeof getAmenitiesRouter>;
	bookmarks: ReturnType<typeof getBookmarksRouter>;
	categories: ReturnType<typeof getCategoriesRouter>;
	cities: ReturnType<typeof getCitiesRouter>;
	collections: ReturnType<typeof getCollectionsRouter>;
	events: ReturnType<typeof getEventsRouter>;
	favorites: ReturnType<typeof getFavoritesRouter>;
	health: ReturnType<typeof getHealthRouter>;
	lists: ReturnType<typeof getListsRouter>;
	places: ReturnType<typeof getPlacesRouter>;
	reports: ReturnType<typeof getReportsRouter>;
	reviews: ReturnType<typeof getReviewsRouter>;
	trips: ReturnType<typeof getTripsRouter>;
	users: ReturnType<typeof getUsersRouter>;
};

export function getAppRouter(): AppRouterShape {
	return {
		aggregator: getAggregatorRouter(),
		amenities: getAmenitiesRouter(),
		bookmarks: getBookmarksRouter(),
		categories: getCategoriesRouter(),
		cities: getCitiesRouter(),
		collections: getCollectionsRouter(),
		events: getEventsRouter(),
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
