import { CollapsibleText } from '@/components/blocks/collapsible-text';
import { UserImage } from '@/components/blocks/user-image';
import { FormattedRating } from '@/components/kit/formatted-rating';
import type { components } from '@/lib/api-types';
import { ipx } from '@/lib/ipx';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import { Menu } from './menu';

type Props = {
  review: components['schemas']['Review'];
};

export function ReviewCard({ review }: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <div className="">
      <div className="flex flex-row items-center gap-4">
        <UserImage
          className="size-16 rounded-full"
          src={review.user.profileImage ?? ''}
        />
        <Link
          to="/u/$username"
          params={{
            username: review.user.username,
          }}
        >
          <div className="font-medium">{review.user.fullName}</div>
          <div className="text-xs text-primary tracking-tight">
            <span className="">@{review.user.username}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">{`${formatDistanceToNow(
            review.createdAt,
          )} ago`}</div>
        </Link>
        <div className="ml-auto">
          <Menu review={review} />
        </div>
      </div>
      <div className="mt-4">
        <CollapsibleText
          text={review.content}
          charLimit={512}
        />
        <div
          className={cn('flex items-center gap-4', {
            'mt-4': review.assets.length > 0,
          })}
        >
          {review.assets.map((m, i) => (
            <button
              type="button"
              key={m.url}
              onClick={() => {
                setIndex(() => {
                  setOpen(true);
                  return i;
                });
              }}
            >
              <img
                src={ipx(m.url, 'w_96')}
                alt=""
                className="aspect-square rounded"
              />
            </button>
          ))}
        </div>
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          slides={review.assets.map((m) => ({
            src: m.url,
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
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FormattedRating
            rating={review.rating}
            votes={1}
            showNumbers={false}
          />
          <span className="text-sm font-semibold">{review.rating}.0</span>
        </div>
      </div>
    </div>
  );
}
