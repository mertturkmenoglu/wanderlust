import { AppType } from '#/index';
import type { Pagination } from '#/pagination';
import { ClientResponse, hc } from 'hono/client';

export const { api } = hc<AppType>(process.env.NEXT_PUBLIC_API_URL!, {
  init: {
    credentials: 'include',
  },
});

export async function rpc<T>(
  fn: () => Promise<ClientResponse<{ data: T }, number, 'json'>>
) {
  const res = await fn();

  if (!res.ok) {
    throw new Error('Error');
  }

  const { data } = await res.json();
  return data;
}

export async function rpcPaginated<T>(
  fn: () => Promise<
    ClientResponse<{ data: T; pagination: Pagination }, number, 'json'>
  >
) {
  const res = await fn();

  if (!res.ok) {
    throw new Error('Error');
  }

  return res.json();
}
