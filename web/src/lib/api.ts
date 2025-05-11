import createFetchClient from 'openapi-fetch';
import createClient from 'openapi-react-query';
import type { components, paths } from './api-types';

export const fetchClient = createFetchClient<paths>({
  baseUrl: 'http://localhost:5000',
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  },
});

export const api = createClient(fetchClient);

export type ApiError = components['schemas']['ErrorModel'];

export function isApiError(v: unknown): v is ApiError {
  if (typeof v !== 'object' || v === null) {
    return false;
  }

  if (
    'title' in v &&
    'status' in v &&
    'detail' in v &&
    typeof v.title === 'string' &&
    typeof v.status === 'number' &&
    typeof v.detail === 'string'
  ) {
    return true;
  }

  return false;
}
