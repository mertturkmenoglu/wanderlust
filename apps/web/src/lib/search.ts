import type { IndexUiState } from 'instantsearch.js';
import type { ConfigurationOptions } from 'typesense/lib/Typesense/Configuration';
import TypesenseInstantSearchAdapter, {
	type BaseSearchParameters,
} from 'typesense-instantsearch-adapter';
import { env } from './env';
import type { Outputs } from './orpc';

export function serializeParams(params?: string[]): string | undefined {
	if (params === undefined) {
		return undefined;
	}

	return params.map((el) => el.split(' ').join('+')).join('|');
}

export function deserializeParams(ser?: IndexUiState) {
	if (ser === undefined) {
		// oxlint-disable-next-line no-useless-undefined
		return undefined;
	}

	if (typeof ser === 'string') {
		// @ts-expect-error - TODO: fix types
		return ser.split('|').map((el) => el.split('+').join(' '));
	}

	return ser;
}

export type SearchResponse<T extends TSearchHit = TPlaceHit> = {
	found: number;
	hits: {
		document: T;
	}[];
	out_of: number;
	page: number;
};

export type TPlaceHit = {
	id: string;
	location: [number, number];
	name: string;
	place: Outputs['places']['get']['place'];
};

export type TCityHit = {
	id: string;
	location: [number, number];
	name: string;
	city: Outputs['cities']['get']['city'];
};

export type TUserHit = {
	id: string;
	name: string;
	username: string;
	image: string | null;
};

export type TSearchHit = TPlaceHit | TCityHit | TUserHit;

export type TypeSenseCollection = 'places' | 'cities' | 'users';

// biome-ignore lint/suspicious/noExplicitAny: This is the type definition from the typesense-instantsearch-adapter package, and we need to use it as is.
type BaseSchema = Record<string, any>;

export class SearchService<T extends BaseSchema> {
	getServerOptions(): ConfigurationOptions {
		return {
			apiKey: env.VITE_SEARCH_CLIENT_API_KEY,
			nodes: [
				{
					url: env.VITE_SEARCH_CLIENT_URL,
				},
			],
			numRetries: 4,
			useServerSideSearchCache: true,
		};
	}

	getDefaultAdapter() {
		return new TypesenseInstantSearchAdapter({
			server: this.getServerOptions(),
			additionalSearchParameters: {
				query_by: [
					'name',
					'place.description',
					'place.subLocality',
					'place.locality',
					'place.adminAreaName',
					'place.countryName',
					'place.city.name',
					'place.city.countryName',
					'place.city.stateName',
					'place.primaryCategory.displayName',
				],
			},
		});
	}

	getDefaultSearchClient() {
		return this.getDefaultAdapter().searchClient;
	}

	getAdapter(additionalSearchParameters: BaseSearchParameters<T>) {
		return new TypesenseInstantSearchAdapter({
			server: this.getServerOptions(),
			additionalSearchParameters,
		});
	}

	getPlacesAdapter(additionalSearchParameters?: BaseSearchParameters<T>) {
		return this.getAdapter({
			query_by: [
				'name',
				'place.description',
				'place.subLocality',
				'place.locality',
				'place.adminAreaName',
				'place.countryName',
				'place.city.name',
				'place.city.countryName',
				'place.city.stateName',
				'place.primaryCategory.displayName',
			],
			per_page: 10,
			...additionalSearchParameters,
		});
	}

	getPlacesSearchClient(additionalSearchParameters?: BaseSearchParameters<T>) {
		return this.getPlacesAdapter(additionalSearchParameters).searchClient;
	}

	getGeoAdapter(additionalSearchParameters?: BaseSearchParameters<T>) {
		return new TypesenseInstantSearchAdapter({
			server: this.getServerOptions(),
			additionalSearchParameters: {
				query_by: 'name',
				per_page: 10,
				...additionalSearchParameters,
			},
			geoLocationField: 'location',
		});
	}

	getGeoSearchClient(additionalSearchParameters?: BaseSearchParameters<T>) {
		return this.getGeoAdapter(additionalSearchParameters).searchClient;
	}

	getUsersAdapter(additionalSearchParameters?: BaseSearchParameters<T>) {
		return new TypesenseInstantSearchAdapter({
			server: this.getServerOptions(),
			additionalSearchParameters: {
				query_by: ['name', 'username'],
				per_page: 10,
				...additionalSearchParameters,
			},
		});
	}

	getUsersSearchClient(additionalSearchParameters?: BaseSearchParameters<T>) {
		return this.getUsersAdapter(additionalSearchParameters).searchClient;
	}

	getCitiesAdapter(additionalSearchParameters?: BaseSearchParameters<T>) {
		return new TypesenseInstantSearchAdapter({
			server: this.getServerOptions(),
			additionalSearchParameters: {
				query_by: [
					'name',
					'city.countryName',
					'city.stateName',
					'city.description',
				],
				per_page: 10,
				...additionalSearchParameters,
			},
		});
	}

	getCitiesSearchClient(additionalSearchParameters?: BaseSearchParameters<T>) {
		return this.getCitiesAdapter(additionalSearchParameters).searchClient;
	}
}
