import { module as aggregator } from './aggregator';
import { module as amenities } from './amenities';
import { module as bookmarks } from './bookmarks';
import { module as categories } from './categories';
import { module as chats } from './chats/chats';
import { module as compose } from './chats/compose';
import { module as cities } from './cities';
import { module as collections } from './collections';
import { module as favorites } from './favorites';
import { module as health } from './health';
import { module as lists } from './lists';
import { module as notifications } from './notifications';
import { module as places } from './places';
import { module as preferences } from './preferences';
import { module as reports } from './reports';
import { module as reviews } from './reviews';
import { module as trips } from './trips';
import { module as users } from './users';

export type AppRouter = {
	aggregator: ReturnType<typeof aggregator.router>;
	amenities: ReturnType<typeof amenities.router>;
	bookmarks: ReturnType<typeof bookmarks.router>;
	categories: ReturnType<typeof categories.router>;
	chats: {
		chats: ReturnType<typeof chats.router>;
		compose: ReturnType<typeof compose.router>;
	};
	cities: ReturnType<typeof cities.router>;
	collections: ReturnType<typeof collections.router>;
	favorites: ReturnType<typeof favorites.router>;
	health: ReturnType<typeof health.router>;
	lists: ReturnType<typeof lists.router>;
	notifications: ReturnType<typeof notifications.router>;
	places: ReturnType<typeof places.router>;
	preferences: ReturnType<typeof preferences.router>;
	reports: ReturnType<typeof reports.router>;
	reviews: ReturnType<typeof reviews.router>;
	trips: ReturnType<typeof trips.router>;
	users: ReturnType<typeof users.router>;
};

export function getAppRouter(): AppRouter {
	return {
		aggregator: aggregator.router(),
		amenities: amenities.router(),
		bookmarks: bookmarks.router(),
		categories: categories.router(),
		chats: {
			chats: chats.router(),
			compose: compose.router(),
		},
		cities: cities.router(),
		collections: collections.router(),
		favorites: favorites.router(),
		health: health.router(),
		lists: lists.router(),
		notifications: notifications.router(),
		places: places.router(),
		preferences: preferences.router(),
		reports: reports.router(),
		reviews: reviews.router(),
		trips: trips.router(),
		users: users.router(),
	};
}

export const exports = [
	aggregator.exports,
	amenities.exports,
	bookmarks.exports,
	categories.exports,
	cities.exports,
	chats.exports,
	compose.exports,
	collections.exports,
	favorites.exports,
	health.exports,
	lists.exports,
	notifications.exports,
	places.exports,
	preferences.exports,
	reports.exports,
	reviews.exports,
	trips.exports,
	users.exports,
].flat();
