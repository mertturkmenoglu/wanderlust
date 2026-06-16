import type { IndexUiState } from 'instantsearch.js';
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

export type TSearchHit = {
	id: string;
	location: [number, number];
	name: string;
	place: Outputs['places']['get']['place'];
};
