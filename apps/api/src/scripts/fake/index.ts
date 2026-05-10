import consola from 'consola';
import { colorize } from 'consola/utils';
import { oraPromise } from 'ora';
import { bootstrapServices } from '@/ioc';
import { generate as generateAddresses } from './handlers/addresses';
import { generate as generateAssets } from './handlers/assets';
import { generate as generateBookmarks } from './handlers/bookmarks';
import { generate as generateCategories } from './handlers/categories';
import { generate as generateCities } from './handlers/cities';
import { generate as generateCollectionItems } from './handlers/collection-items';
import { generate as generateCollections } from './handlers/collections';
import { generate as generateCollectionsCities } from './handlers/collections-cities';
import { generate as generateCollectionsPlaces } from './handlers/collections-places';
import { generate as generateFavorites } from './handlers/favorites';
import { generate as generateFollows } from './handlers/follows';
import { generate as generateFakeIds } from './handlers/id';
import { generate as generateListItems } from './handlers/list-items';
import { generate as generateLists } from './handlers/lists';
import { generate as generatePlaces } from './handlers/places';
import { generate as generateReviewAssets } from './handlers/review-assets';
import { generate as generateReviews } from './handlers/reviews';
import { generate as generateUsers } from './handlers/users';

export const paths = {
	places: 'tmp/places.txt',
	users: 'tmp/users.txt',
	reviews: 'tmp/reviews.txt',
	collections: 'tmp/collections.txt',
	lists: 'tmp/lists.txt',
} as const;

const mapping = {
	categories: generateCategories,
	cities: generateCities,
	addresses: generateAddresses,
	users: generateUsers,
	places: generatePlaces,
	'fake-id': generateFakeIds,
	assets: generateAssets,
	follows: generateFollows,
	favorites: generateFavorites,
	bookmarks: generateBookmarks,
	reviews: generateReviews,
	'review-assets': generateReviewAssets,
	collections: generateCollections,
	'collection-items': generateCollectionItems,
	'collections-cities': generateCollectionsCities,
	'collections-places': generateCollectionsPlaces,
	lists: generateLists,
	'list-items': generateListItems,
} as const satisfies Record<string, () => Promise<void>>;

type Step = keyof typeof mapping;

const steps: Step[] = [
	'categories',
	'cities',
	'addresses',
	'users',
	'places',
	'fake-id', // run fake id to get user and places ids
	'assets',
	'follows',
	'reviews',
	'fake-id', // run fake id again to get review ids
	'review-assets',
	'collections',
	'fake-id', // run fake id again to get collection ids
	'collection-items',
	'collections-cities',
	'collections-places',
	'lists',
	'fake-id', // run fake id again to get list ids
	'list-items',
	'favorites',
	'bookmarks',
];

async function main() {
	await bootstrapServices();

	consola.start('Starting fake data generation');

	const start = Date.now();

	for (const step of steps) {
		const stepStart = Date.now();
		const handler = mapping[step];

		await oraPromise(handler(), {
			text: `Running step: ${colorize('underline', step)}`,
			successText: () => `${step} completed in ${colorize('cyan', ((Date.now() - stepStart) / 1000).toFixed(2))} seconds`,
			failText: (err) => `${step} failed: ${err instanceof Error ? err.message : String(err)}`,
		})
	}

	const elapsed = (Date.now() - start) / 1000;
	consola.info('Total elapsed time:', colorize('cyan', elapsed.toFixed(2)), 'seconds');
}

await main();
