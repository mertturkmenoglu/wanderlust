import type { IndexUiState } from 'instantsearch.js';

export function serializeParams(params?: string[]) {
  if (params === undefined) {
    return undefined;
  }

  return params.map((el) => el.split(' ').join('+')).join('|');
}

export function deserializeParams(ser?: IndexUiState) {
  if (ser === undefined) {
    return undefined;
  }

  if (typeof ser === 'string') {
    // @ts-expect-error
    return ser.split('|').map((el) => el.split('+').join(' '));
  }

  return ser;
}
