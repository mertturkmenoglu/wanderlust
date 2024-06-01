import { AppType } from '#/index';
import { ClientResponse, hc } from 'hono/client';

export const { api } = hc<AppType>(process.env.NEXT_PUBLIC_API_URL!, {
  init: {
    credentials: 'include',
  },
});

export async function rpc<T>(
  fn: () => Promise<ClientResponse<T, number, 'json'>>
) {
  const res = await fn();

  if (!res.ok) {
    throw new Error('Error');
  }

  return res.json();
}
