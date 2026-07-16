import type { IndexUiState } from 'instantsearch.js';

export function serializeParams(params?: string[]): string | undefined {
	if (params === undefined) {
		return undefined;
	}

	return params.map((el) => el.split(' ').join('+')).join('|');
}

export function deserializeParams(ser?: IndexUiState | string) {
	if (ser === undefined) {
		return undefined;
	}

	if (typeof ser === 'string') {
		const parts = ser.split('|');

		return parts.map((el) => el.split('+').join(' '));
	}

	return ser;
}
