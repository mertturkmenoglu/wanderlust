import type { ConfigurationOptions } from 'typesense/lib/Typesense/Configuration';
import TypesenseInstantSearchAdapter, {
	type BaseSearchParameters,
} from 'typesense-instantsearch-adapter';
import { env } from '@/lib/env';
import type { BaseSchema } from './types';

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
