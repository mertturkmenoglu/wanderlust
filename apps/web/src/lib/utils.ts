import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
