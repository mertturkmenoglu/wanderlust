import AppMessage from '@/components/blocks/app-message';
import { ipx } from '@/lib/ipx';
import { cn } from '@/lib/utils';
import { getRouteApi } from '@tanstack/react-router';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';

export default function Media() {
  const route = getRouteApi('/diary/$id/');
  const { entry } = route.useLoaderData();
  const [open, setOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  return (
    <>
      <div className="text-xl font-medium">Media</div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {entry.media.length === 0 && (
          <AppMessage
            emptyMessage="No images"
            showBackButton={false}
            className="col-span-full"
          />
        )}
        {entry.media.map((m, i) => (
          <button
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
              alt={m.alt}
              className={cn(
                'aspect-square md:aspect-video object-cover size-48 rounded-md w-full',
              )}
            />
          </button>
        ))}
      </div>

      <Lightbox
        open={open}
        plugins={[Captions]}
        close={() => setOpen(false)}
        slides={entry.media.map((m) => ({
          src: m.url,
          description: m.caption ?? '',
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
