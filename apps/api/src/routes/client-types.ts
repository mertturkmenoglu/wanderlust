// Type-only file: imports contracts only, no server implementations.
// Keeping this isolated means the IDE evaluates simpler types (no middleware
// context chains) when resolving AppRouterClient in the web app.
import type {
	AnyContractRouter,
	ContractProcedure,
	ErrorFromErrorMap,
	InferSchemaInput,
	InferSchemaOutput,
} from '@orpc/contract';
import type { Client } from '@orpc/client';

import { contract as aggregatorContract } from './aggregator/contract';
import { contract as amenitiesContract } from './amenities/contract';
import { contract as bookmarksContract } from './bookmarks/contract';
import { contract as categoriesContract } from './categories/contract';
import { contract as citiesContract } from './cities/contract';
import { contract as collectionsContract } from './collections/contract';
import { contract as eventsContract } from './events/contract';
import { contract as favoritesContract } from './favorites/contract';
import { contract as healthContract } from './health/contract';
import { contract as listsContract } from './lists/contract';
import { contract as placesContract } from './places/contract';
import { contract as reportsContract } from './reports/contract';
import { contract as reviewsContract } from './reviews/contract';
import { contract as tripsContract } from './trips/contract';
import { contract as usersContract } from './users/contract';

// Maps a contract router tree to a callable client tree, stripping all
// server-side types (middleware context, meta, etc.).
type ContractRouterClient<T extends AnyContractRouter> =
	T extends ContractProcedure<infer UInput, infer UOutput, infer UErrors, any>
		? Client<Record<never, never>, InferSchemaInput<UInput>, InferSchemaOutput<UOutput>, ErrorFromErrorMap<UErrors>>
		: { [K in keyof T]: T[K] extends AnyContractRouter ? ContractRouterClient<T[K]> : never };

const appContract = {
	aggregator: aggregatorContract,
	amenities: amenitiesContract,
	bookmarks: bookmarksContract,
	categories: categoriesContract,
	cities: citiesContract,
	collections: collectionsContract,
	events: eventsContract,
	favorites: favoritesContract,
	health: healthContract,
	lists: listsContract,
	places: placesContract,
	reports: reportsContract,
	reviews: reviewsContract,
	trips: tripsContract,
	users: usersContract,
} as const;

export type AppContract = typeof appContract;
export type AppRouterClient = ContractRouterClient<AppContract>;
