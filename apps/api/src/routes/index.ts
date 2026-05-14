import type { RouterClient } from '@orpc/server';
import * as aggregator from './aggregator';
import * as amenities from './amenities';
import * as bookmarks from './bookmarks';
import * as categories from './categories';
import * as cities from './cities';
import * as collections from './collections';
import * as events from './events';
import * as favorites from './favorites';
import * as health from './health';
import * as lists from './lists';
import * as places from './places';
import * as reports from './reports';
import * as reviews from './reviews';
import * as trips from './trips';
import * as users from './users';

type AppRouterShape = {
	aggregator: ReturnType<typeof aggregator.getRouter>;
	amenities: ReturnType<typeof amenities.getRouter>;
	bookmarks: ReturnType<typeof bookmarks.getRouter>;
	categories: ReturnType<typeof categories.getRouter>;
	cities: ReturnType<typeof cities.getRouter>;
	collections: ReturnType<typeof collections.getRouter>;
	events: ReturnType<typeof events.getRouter>;
	favorites: ReturnType<typeof favorites.getRouter>;
	health: ReturnType<typeof health.getRouter>;
	lists: ReturnType<typeof lists.getRouter>;
	places: ReturnType<typeof places.getRouter>;
	reports: ReturnType<typeof reports.getRouter>;
	reviews: ReturnType<typeof reviews.getRouter>;
	trips: ReturnType<typeof trips.getRouter>;
	users: ReturnType<typeof users.getRouter>;
};

export function getAppRouter(): AppRouterShape {
	return {
		aggregator: aggregator.getRouter(),
		amenities: amenities.getRouter(),
		bookmarks: bookmarks.getRouter(),
		categories: categories.getRouter(),
		cities: cities.getRouter(),
		collections: collections.getRouter(),
		events: events.getRouter(),
		favorites: favorites.getRouter(),
		health: health.getRouter(),
		lists: lists.getRouter(),
		places: places.getRouter(),
		reports: reports.getRouter(),
		reviews: reviews.getRouter(),
		trips: trips.getRouter(),
		users: users.getRouter(),
	};
}

export const modules = [
	aggregator.module,
	bookmarks.module,
	categories.module,
	cities.module,
	collections.module,
	lists.module,
	users.module,
	trips.module,
	reviews.module,
	reports.module,
	places.module,
	favorites.module,
	events.module,
];

export type AppRouter = ReturnType<typeof getAppRouter>;
export type AppRouterClient = RouterClient<AppRouter>;
