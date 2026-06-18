import type { IndexUiState } from 'instantsearch.js';
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

export type SearchResponse<T = TSearchHit> = {
	found: number;
	hits: {
		document: T;
	}[];
	out_of: number;
	page: number;
};

export type TSearchHit = {
	id: string;
	location: [number, number];
	name: string;
	place: Outputs['places']['get']['place'];
};

export type TSearchCityHit = {
	id: string;
	location: [number, number];
	name: string;
	city: Outputs['cities']['get']['city'];
};

type TypeSenseCollection = 'places' | 'cities';

export class TypesenseQueryBuilder {
	private readonly sp: URLSearchParams;

	constructor() {
		this.sp = new URLSearchParams();
	}

	append(name: string, value: string) {
		this.sp.append(name, value);
		return this;
	}

	delete(name: string, value?: string) {
		this.sp.delete(name, value);
		return this;
	}

	getSearchParams() {
		return this.sp;
	}

	set(name: string, value: string) {
		this.sp.set(name, value);
		return this;
	}

	sort() {
		this.sp.sort();
		return this;
	}

	build() {
		return this.sp.toString();
	}
}

export async function searchTypesense<T = TSearchHit>(
	collection: TypeSenseCollection,
	query: string,
) {
	const searchApiKey = env.VITE_SEARCH_CLIENT_API_KEY;
	const searchApiUrl = env.VITE_SEARCH_CLIENT_URL;

	const url = new URL(`/collections/${collection}/documents/search?${query}`, searchApiUrl);

	const res = await fetch(url.toString(), {
		headers: {
			'X-TYPESENSE-API-KEY': searchApiKey,
		},
	});

	const data = (await res.json()) as SearchResponse<T>;
	return data;
}
