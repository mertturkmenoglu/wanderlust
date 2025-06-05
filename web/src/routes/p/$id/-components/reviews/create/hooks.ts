import { fetchClient } from '@/lib/api';
import * as fileUpload from '@zag-js/file-upload';
import { normalizeProps, useMachine } from '@zag-js/react';
import { useId } from 'react';
import { toast } from 'sonner';

export function useUpload() {
  const service = useMachine(fileUpload.machine, {
    id: useId(),
    accept: ['image/jpeg', 'image/png'],
    maxFiles: 4,
    maxFileSize: 1024 * 1024 * 10, // 5MB
  });

  return fileUpload.connect(service, normalizeProps);
}

export type UseUpload = ReturnType<typeof useUpload>;

export function usePreviews(up: UseUpload) {
  return up.acceptedFiles.map((file) => URL.createObjectURL(file));
}

type Ext = 'jpg' | 'jpeg' | 'png';

export function checkExtensions(
  extensions: (string | undefined)[],
): extensions is Ext[] {
  for (const ext of extensions) {
    if (!ext) {
      toast.error('Invalid file type');
      return false;
    }

    if (ext !== 'jpg' && ext !== 'jpeg' && ext !== 'png') {
      toast.error('Invalid file type');
      return false;
    }
  }

  return true;
}

export async function doFileUpload(files: File[], reviewId: string) {
  const extensions = files.map((file) => file.name.split('.').at(-1));

  if (!checkExtensions(extensions)) {
    return false;
  }

  for (let i = 0; i < files.length; i++) {
    let ext = extensions.at(i)!;
    let file = files.at(i)!;

    const res = await fetchClient.GET('/api/v2/images/upload/', {
      params: {
        query: {
          bucket: 'reviews',
          fileExt: ext,
        },
      },
    });

    if (res.error) {
      toast.error(res.error.title ?? 'Something went wrong');
      return false;
    }

    const uploadRes = await fetch(res.data.url, {
      method: 'PUT',
      body: file,
    });

    if (!uploadRes.ok) {
      toast.error('Something went wrong');
      return false;
    }

    const updateRes = await fetchClient.POST('/api/v2/reviews/{id}/media', {
      params: {
        path: {
          id: reviewId,
        },
      },
      body: {
        fileName: res.data.fileName,
        id: res.data.id,
        size: 0,
      },
    });

    if (updateRes.error) {
      toast.error(updateRes.error.title ?? 'Something went wrong');
      return false;
    }
  }

  return true;
};
