import type { Outputs } from '../orpc';

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
export type BaseSchema = Record<string, any>;
