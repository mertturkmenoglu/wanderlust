import { CreateMediaDto } from "./dto";

export function userImage(s: string | null): string {
  if (s == null) {
    return "http://localhost:5173/profile.png";
  }

  if (s.startsWith("//")) {
    // TODO: change protocol according to dev later
    return "http:" + s;
  }

  return s;
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
      console.error("Failed to get image dimensions", e);
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

export function mapImagesToMedia(
  urls: string[],
  files: File[],
  dims: Array<{ width: number; height: number }>
): CreateMediaDto[] {
  return urls.map((url, i) => {
    return {
      type: "image",
      url,
      thumbnail: url,
      alt: files[i].name,
      caption: files[i].name,
      width: dims[i].width,
      height: dims[i].height,
    };
  });
}
