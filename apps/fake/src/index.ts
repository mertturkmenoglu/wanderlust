import consola from 'consola';
import { colorize } from 'consola/utils';
import { oraPromise } from 'ora';
import {
	accoladeAssignmentsGenerator,
	accoladesGenerator,
} from './generators/accolades';
import { assetsGenerator } from './generators/assets';
import { bookmarksGenerator } from './generators/bookmarks';
import { categoriesGenerator } from './generators/categories';
import { citiesGenerator } from './generators/cities';
import { cleanupGenerator } from './generators/cleanup';
import {
	collectionItemsGenerator,
	collectionsCitiesGenerator,
	collectionsGenerator,
	collectionsPlacesGenerator,
} from './generators/collections';
import { fakeIdGenerator } from './generators/fake-id';
import { favoritesGenerator } from './generators/favorites';
import { listItemsGenerator, listsGenerator } from './generators/lists';
import { placesGenerator } from './generators/places';
import { reviewAssetsGenerator, reviewsGenerator } from './generators/reviews';
import { followsGenerator, usersGenerator } from './generators/users';
import type { GeneratorDefinition } from './lib/define-generator';

const mapping = {
	categories: categoriesGenerator,
	cities: citiesGenerator,
	users: usersGenerator,
	accolades: accoladesGenerator,
	'accolade-assignments': accoladeAssignmentsGenerator,
	places: placesGenerator,
	'fake-id': fakeIdGenerator,
	assets: assetsGenerator,
	follows: followsGenerator,
	favorites: favoritesGenerator,
	bookmarks: bookmarksGenerator,
	reviews: reviewsGenerator,
	'review-assets': reviewAssetsGenerator,
	collections: collectionsGenerator,
	'collection-items': collectionItemsGenerator,
	'collections-cities': collectionsCitiesGenerator,
	'collections-places': collectionsPlacesGenerator,
	lists: listsGenerator,
	'list-items': listItemsGenerator,
	cleanup: cleanupGenerator,
} as const satisfies Record<string, GeneratorDefinition>;

type Step = keyof typeof mapping;

const steps: Step[] = [
	'categories',
	'cities',
	'users',
	'accolades',
	'fake-id', // run fake id to get accolade ids for other steps
	'places',
	'fake-id', // run fake id to get user and places ids
	'accolade-assignments',
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
	'cleanup',
];

async function main() {
	consola.start('Starting fake data generation');

	const start = Date.now();

	for (const step of steps) {
		const stepStart = Date.now();
		const generator = mapping[step];

		await oraPromise(generator.generate(), {
			text: `Running step: ${colorize('underline', step)}`,
			successText: () =>
				`${step} completed in ${colorize('cyan', ((Date.now() - stepStart) / 1000).toFixed(2))} seconds`,
			failText: (err) =>
				`${step} failed: ${err instanceof Error ? err.message : String(err)}`,
		});
	}

	const elapsed = (Date.now() - start) / 1000;
	consola.info(
		'Total elapsed time:',
		colorize('cyan', elapsed.toFixed(2)),
		'seconds',
	);

	process.exit(0);
}

await main();
