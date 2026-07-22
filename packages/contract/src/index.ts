import { Accolades } from './accolades';
import { Aggregator } from './aggregator';
import { Amenities } from './amenities';
import { Assets } from './assets';
import { Bookmarks } from './bookmarks';
import { Categories } from './categories';
import { Cities } from './cities';
import { Collections } from './collections';
import { Favorites } from './favorites';
import { Health } from './health';
import { Lists } from './lists';
import { Notifications } from './notifications';
import { Places } from './places';
import { Preferences } from './preferences';
import { Reports } from './reports';
import { Reviews } from './reviews';
import { Trips } from './trips';
import { Users } from './users';

export type AppRouter = {
	assets: Assets.Contract;
	accolades: Accolades.Contract;
	aggregator: Aggregator.Contract;
	amenities: Amenities.Contract;
	bookmarks: Bookmarks.Contract;
	categories: Categories.Contract;
	cities: Cities.Contract;
	collections: Collections.Contract;
	favorites: Favorites.Contract;
	health: Health.Contract;
	lists: Lists.Contract;
	notifications: Notifications.Contract;
	places: Places.Contract;
	preferences: Preferences.Contract;
	reports: Reports.Contract;
	reviews: Reviews.Contract;
	trips: Trips.Contract;
	users: Users.Contract;
};

export {
	Accolades,
	Aggregator,
	Amenities,
	Assets,
	Bookmarks,
	Categories,
	Cities,
	Collections,
	Favorites,
	Health,
	Lists,
	Notifications,
	Places,
	Preferences,
	Reports,
	Reviews,
	Trips,
	Users,
};
