import { module as aggregator } from './aggregator';
import { module as amenities } from './amenities';
import { module as bookmarks } from './bookmarks';
import { module as categories } from './categories';
import { module as cities } from './cities';
import { module as collections } from './collections';
import { module as favorites } from './favorites';
import { module as health } from './health';
import { module as lists } from './lists';
import { module as places } from './places';
import { module as preferences } from './preferences';
import { module as reports } from './reports';
import { module as reviews } from './reviews';
import { module as trips } from './trips';
import { module as users } from './users';

const features = {
	aggregator,
	amenities,
	bookmarks,
	categories,
	cities,
	collections,
	favorites,
	health,
	lists,
	places,
	preferences,
	reports,
	reviews,
	trips,
	users,
} as const;

type FeatureName = keyof typeof features;
type M = (typeof features)[FeatureName];

export type AppRouter = {
	[K in FeatureName]: ReturnType<M['router']>;
};

export function getAppRouter(): AppRouter {
	return Object.fromEntries(
		Object.entries(features).map(([name, feature]) => [name, feature.router()]),
	) as AppRouter;
}

export const exports = Object.values(features).flatMap((f) => f.exports);
