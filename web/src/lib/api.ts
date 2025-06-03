import createFetchClient, { type Middleware } from 'openapi-fetch';
import createClient from 'openapi-react-query';
import type { components, paths } from './api-types';

const apiUrl = import.meta.env.VITE_API_URL;

export const fetchClient = createFetchClient<paths>({
  baseUrl: apiUrl,
  credentials: 'include',
});

const mw: Middleware = {
  async onResponse({ request, response }) {
    if (response.ok) {
      return response;
    }

    if (response.status !== 401) {
      return response;
    }

    const refresh = await fetch(`${apiUrl}/api/v2/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!refresh.ok) {
      return response;
    }

    const retry = await fetch(new Request(request));
    if (retry.ok) {
      return retry;
    }

    if (retry.status === 401) {
      return retry;
    }

    return response;
  },
};

fetchClient.use(mw);

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
