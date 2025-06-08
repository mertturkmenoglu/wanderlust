import { ipx } from '@/lib/ipx';
import { cn } from '@/lib/utils';
import { getRouteApi } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';

type Props = {
  className?: string;
};

export function ImageGrid({ className }: Props) {
  const route = getRouteApi('/p/$id/');
  const { poi } = route.useLoaderData();
  const images = poi.images;
  const first = images[0];

  const rest = useMemo(() => {
    const slice = images.slice(1, 5) as Array<{
      id: number;
      url: string;
      alt: string;
    }>;
    if (slice.length < 4) {
      let pad = 4 - slice.length;

      for (let i = 0; i < pad; i++) {
        slice.push({
          id: Math.random(),
          url: '',
          alt: '',
        });
      }
    }
    return slice;
  }, [images]);

  const [open, setOpen] = useState(false);

  if (!first) {
    return null;
  }

  return (
    <div
      className={cn(
        'grid grid-cols-4 grid-rows-2 gap-2 rounded-xl h-[256px] md:h-[384px] lg:h-[512px] relative',
        className,
      )}
    >
      <div className="col-span-2 row-span-2">
        <img
          src={ipx(first.url, 'w_1024')}
          alt={first.alt}
          className="w-full h-full object-cover rounded-l-xl"
        />
      </div>
      {rest.map((img, i) => (
        <div
          className={cn('col-span-1 row-span-1')}
          key={img.id}
        >
          {img.url !== '' ? (
            <img
              src={ipx(img.url, 'w_512')}
              alt={img.alt}
              className={cn('w-full h-full object-cover', {
                'rounded-tr-xl': i === 1,
                'rounded-br-xl': i === 3,
              })}
            />
          ) : (
            <div
              className={cn('w-full h-full object-cover bg-muted', {
                'rounded-tr-xl': i === 1,
                'rounded-br-xl': i === 3,
              })}
            />
          )}
        </div>
      ))}
      <button
        className="absolute bottom-4 right-4 bg-primary text-white rounded-md px-4 py-2"
        onClick={() => setOpen(true)}
      >
        See more
      </button>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={images.map((img) => ({
          src: img.url,
        }))}
        animation={{ fade: 0 }}
        controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
        styles={{
          container: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          },
        }}
      />
    </div>
  );
}
