import * as accolades from './accolades';
import * as addresses from './addresses';
import * as aggregator from './aggregator';
import * as amenities from './amenities';
import * as bookmarks from './bookmarks';
import * as categories from './categories';
import * as chats from './chats';
import * as cities from './cities';
import * as collections from './collections';
import * as favorites from './favorites';
import * as health from './health';
import * as lists from './lists';
import * as notifications from './notifications';
import * as places from './places';
import * as preferences from './preferences';
import * as reports from './reports';
import * as reviews from './reviews';
import * as trips from './trips';
import * as users from './users';

export type AppRouter = {
	accolades: accolades.Contract;
	addresses: addresses.Contract;
	aggregator: aggregator.Contract;
	amenities: amenities.Contract;
	bookmarks: bookmarks.Contract;
	categories: categories.Contract;
	chats: {
		chats: chats.chats.Contract;
		compose: chats.compose.Contract;
	};
	cities: cities.Contract;
	collections: collections.Contract;
	favorites: favorites.Contract;
	health: health.Contract;
	lists: lists.Contract;
	notifications: notifications.Contract;
	places: places.Contract;
	preferences: preferences.Contract;
	reports: reports.Contract;
	reviews: reviews.Contract;
	trips: trips.Contract;
	users: users.Contract;
};

export {
	accolades,
	addresses,
	aggregator,
	amenities,
	bookmarks,
	categories,
	chats,
	cities,
	collections,
	favorites,
	health,
	lists,
	notifications,
	places,
	preferences,
	reports,
	reviews,
	trips,
	users,
};
