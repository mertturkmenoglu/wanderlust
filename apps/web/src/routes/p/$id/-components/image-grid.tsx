import { Button } from '@/components/ui/button';
import { ipx } from '@/lib/ipx';
import { cn } from '@/lib/utils';
import { getRouteApi } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';

type Props = {
  className?: string;
};

export function ImageGrid({ className }: Props) {
  const route = getRouteApi('/p/$id/');
  const { place } = route.useLoaderData();
  const images = place.assets;
  const first = images[0];

  const rest = useMemo(() => {
    const slice = images.slice(1, 5) as {
      id: number;
      url: string;
      description: string;
    }[];

    if (slice.length < 4) {
      let pad = 4 - slice.length;

      for (let i = 0; i < pad; i += 1) {
        slice.push({
          id: Math.random(),
          url: '',
          description: '',
        });
      }
    }
    return slice;
  }, [images]);

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (!first) {
    return null;
  }

  return (
    <div
      className={cn(
        'grid grid-cols-4 grid-rows-2 gap-2 rounded-xl h-64 md:h-96 lg:h-[512px] relative',
        className,
      )}
    >
      <div className="col-span-2 row-span-2">
        <button
          type="button"
          className="w-full h-full object-cover rounded-l-xl"
          onClick={() =>
            setIndex(() => {
              setOpen(true);
              return 0;
            })
          }
        >
          <img
            src={ipx(first.url, 'w_1024')}
            alt={first.description ?? ''}
            className="w-full h-full object-cover rounded-l-xl"
          />
        </button>
      </div>
      {rest.map((img, i) => (
        <button
          type="button"
          className={cn('col-span-1 row-span-1')}
          key={img.id}
          onClick={() => {
            if (img.url !== '') {
              setIndex(() => {
                setOpen(true);
                return i + 1;
              });
            }
          }}
        >
          {img.url !== '' ? (
            <img
              src={ipx(img.url, 'w_512')}
              alt={img.description ?? ''}
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
        </button>
      ))}
      <Button
        type="button"
        className="absolute bottom-4 right-4"
        size="sm"
        onClick={() =>
          setIndex(() => {
            setOpen(true);
            return 0;
          })
        }
      >
        See all
      </Button>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        plugins={[Thumbnails]}
        slides={images.map((img) => ({
          src: img.url,
        }))}
        animation={{ fade: 0 }}
        controller={{
          closeOnPullDown: true,
          closeOnBackdropClick: true,
        }}
        index={index}
        styles={{
          container: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          },
        }}
      />
    </div>
  );
}
