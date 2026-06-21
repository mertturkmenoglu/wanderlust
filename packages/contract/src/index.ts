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

export type AppRouter = {
	aggregator: aggregator.Contract;
	amenities: amenities.Contract;
	bookmarks: bookmarks.Contract;
	categories: categories.Contract;
	cities: cities.Contract;
	collections: collections.Contract;
	events: events.Contract;
	favorites: favorites.Contract;
	health: health.Contract;
	lists: lists.Contract;
	places: places.Contract;
	reports: reports.Contract;
	reviews: reviews.Contract;
	trips: trips.Contract;
	users: users.Contract;
}

export {
	aggregator,
	amenities,
	bookmarks,
	categories,
	cities,
	collections,
	events,
	favorites,
	health,
	lists,
	places,
	reports,
	reviews,
	trips,
	users,
};
