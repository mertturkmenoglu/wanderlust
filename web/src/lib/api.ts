import createFetchClient from 'openapi-fetch';
import createClient from 'openapi-react-query';
import type { paths } from './api-types';

export const fetchClient = createFetchClient<paths>({
  baseUrl: 'http://localhost:5000',
});

export const api = createClient(fetchClient);
