import { SuspenseWrapper } from '@/components/blocks/suspense-wrapper';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { getRouteApi } from '@tanstack/react-router';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';

type Props = {
  className?: string;
};

export function ReviewImages({ className }: Props) {
  return (
    <SuspenseWrapper>
      <Content className={className} />
    </SuspenseWrapper>
  );
}

type ContentProps = {
  className?: string;
};

function Content({ className }: ContentProps) {
  const route = getRouteApi('/p/$id/');
  const { id } = route.useParams();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const query = api.useSuspenseQuery('get', '/api/v2/reviews/place/{id}/assets', {
    params: {
      path: {
        id,
      },
    },
  });

  const images = query.data.assets;
  const showMoreCount = Math.min(images.length - 4, 20);

  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-2',
        className,
      )}
    >
      {images.slice(0, 4).map((image, i) => (
        <button
          type="button"
          key={image.id}
          onClick={() => {
            setIndex(() => {
              setOpen(true);
              return i;
            });
          }}
          className="relative"
        >
          <img
            key={image.id}
            src={image.url}
            alt=""
            className="aspect-square rounded cursor-pointer"
          />
          {i === 3 && images.length > 4 && (
            <div
              className={cn(
                'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                'text-white bg-primary/90 rounded-full p-1 size-10 text-sm',
                'flex flex-row items-center justify-center gap-0',
              )}
            >
              +{showMoreCount}
            </div>
          )}
        </button>
      ))}

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={images.map((img) => ({
          src: img.url,
        }))}
        carousel={{
          finite: true,
        }}
        controller={{
          closeOnBackdropClick: true,
        }}
        styles={{
          container: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          },
        }}
        index={index}
      />
    </div>
  );
}
