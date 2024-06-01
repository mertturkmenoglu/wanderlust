import { api, rpc } from '@/lib/api';

export function getImageDims(
  f: File
): Promise<{ width: number; height: number }> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      res({ width: img.width, height: img.height });
    };
    img.onerror = (err) => {
      rej(err);
    };
    img.src = URL.createObjectURL(f);
  });
}

export function getPreview(f: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target) {
        res(event.target.result as string);
      }
    };
    reader.onerror = (err) => {
      rej(err);
    };
    reader.readAsDataURL(f);
  });
}

export async function uploadImages(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const url = await rpc(() =>
      api.uploads['new-url'].$get({
        query: {
          type: 'reviews',
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

export async function getDims(
  files: File[]
): Promise<Array<{ width: number; height: number }>> {
  const dims: Array<{ width: number; height: number }> = [];
  for (const f of files) {
    try {
      const dim = await getImageDims(f);
      dims.push(dim);
    } catch (e) {
      console.error('Failed to get image dimensions', e);
    }
  }
  return dims;
}

export async function postReview({
  comment,
  rating,
  locationId,
  files,
  urls,
  dims,
}: {
  comment: string;
  rating: number;
  locationId: string;
  files: File[];
  urls: string[];
  dims: Array<{ width: number; height: number }>;
}) {
  return rpc(() => {
    return api.reviews.$post({
      json: {
        comment,
        rating,
        locationId,
        media: urls.map((url, i) => {
          return {
            type: 'image',
            url,
            thumbnail: url,
            alt: files[i].name,
            caption: files[i].name,
            width: dims[i].width,
            height: dims[i].height,
          };
        }),
      },
    });
  });
}
