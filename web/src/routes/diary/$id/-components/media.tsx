import { AppMessage } from '@/components/blocks/app-message';
import { ipx } from '@/lib/ipx';
import { cn } from '@/lib/utils';
import { getRouteApi } from '@tanstack/react-router';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';

export function Media() {
  const route = getRouteApi('/diary/$id/');
  const { diary } = route.useLoaderData();
  const [open, setOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  return (
    <>
      <div className="text-xl font-medium">Media</div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {diary.images.length === 0 && (
          <AppMessage
            emptyMessage="No images"
            showBackButton={false}
            className="col-span-full"
          />
        )}
        {diary.images.map((m, i) => (
          <button
            type="button"
            key={m.url}
            className={cn('aspect-square md:aspect-video size-48 w-full', {})}
            onClick={() => {
              setImageIndex(() => {
                setOpen(true);
                return i;
              });
            }}
          >
            <img
              src={ipx(m.url, 'w_512')}
              className={cn(
                'aspect-square md:aspect-video object-cover size-48 rounded-md w-full',
              )}
              alt=""
            />
          </button>
        ))}
      </div>

      <Lightbox
        open={open}
        plugins={[Captions]}
        close={() => setOpen(false)}
        slides={diary.images.map((m) => ({
          src: m.url,
          description: '',
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
        index={imageIndex}
      />
    </>
  );
}
