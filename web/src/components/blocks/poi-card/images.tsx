import { ipx } from '@/lib/ipx';
import { usePoiCardContext } from './context';
import { Image } from '@unpic/react';

export function Images() {
  const ctx = usePoiCardContext();
  const { poi, index, image } = ctx;

  return (
    <>
      {/* Preload previous and next images */}
      {index !== 0 && (
        <Image
          src={ipx(poi.images[index - 1]?.url ?? '', 'w_512')}
          alt={poi.images[index - 1]?.alt}
          className="hidden"
          width={512}
          aspectRatio={16 / 9}
        />
      )}

      {index !== poi.images.length - 1 && (
        <Image
          src={ipx(poi.images[index + 1]?.url ?? '', 'w_512')}
          alt={poi.images[index + 1]?.alt}
          className="hidden"
          width={512}
          aspectRatio={16 / 9}
        />
      )}

      <Image
        src={ipx(image.url, 'w_512')}
        alt={image.alt}
        className="aspect-video w-full rounded-md object-cover"
        width={512}
        aspectRatio={16 / 9}
        priority
      />
    </>
  );
}
