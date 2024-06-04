import { AppType } from '#/index';
import { ClientResponse, hc } from 'hono/client';
import { UploadImageType } from './types';

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

export async function uploadImages(
  files: File[],
  type: UploadImageType
): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const url = await rpc(() =>
      api.uploads['new-url'].$get({
        query: {
          type,
          count: `1`,
          mime: file.type,
        },
      })
    );

    try {
      const r = await fetch(url.data[0].url, {
        method: 'PUT',
        body: file,
      });
      if (r.ok) {
        urls.push(url.data[0].url);
      }
    } catch (err) {
      console.error('Failed to upload file', err);
    }
  }

  for (let i = 0; i < urls.length; i++) {
    urls[i] = urls[i].split('?')[0];
  }

  return urls;
}
