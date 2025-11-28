import { ipx } from '@/lib/ipx';
import { usePlaceCardContext } from './context';
import { Image } from '@unpic/react';

export function Images() {
  const ctx = usePlaceCardContext();
  const { place, index, asset } = ctx;

  return (
    <>
      {/* Preload previous and next images */}
      {index !== 0 && (
        <Image
          src={ipx(place.assets[index - 1]?.url ?? '', 'w_512')}
          alt={place.assets[index - 1]?.description ?? ''}
          className="hidden"
          width={512}
          aspectRatio={16 / 9}
        />
      )}

      {index !== place.assets.length - 1 && (
        <Image
          src={ipx(place.assets[index + 1]?.url ?? '', 'w_512')}
          alt={place.assets[index + 1]?.description ?? ''}
          className="hidden"
          width={512}
          aspectRatio={16 / 9}
        />
      )}

      <Image
        src={ipx(asset.url, 'w_512')}
        alt={asset.description ?? ''}
        className="aspect-video w-full rounded-md object-cover"
        width={512}
        aspectRatio={16 / 9}
        priority
      />
    </>
  );
}
