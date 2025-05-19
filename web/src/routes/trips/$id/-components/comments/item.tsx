import UserImage from '@/components/blocks/user-image';
import type { components } from '@/lib/api-types';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';
import { formatDistanceToNow } from 'date-fns';

type Props = {
  comment: components['schemas']['TripComment'];
};

export function Item({ comment }: Props) {
  return (
    <div className="border-t border-border py-4">
      <div className="flex items-start gap-4">
        <UserImage
          src={ipx(userImage(comment.from.profileImage), 'w_512')}
          imgClassName="size-16"
          fallbackClassName="size-16 rounded-md"
          className="size-16 rounded-md"
        />
        <div className="">
          <div className="font-bold">{comment.from.fullName}</div>
          <div className="text-primary text-sm">@{comment.from.username}</div>

          <div className="mt-4">{comment.content}</div>
        </div>

        <div className="ml-auto text-xs text-muted-foreground">
          {formatDistanceToNow(comment.createdAt)} ago
        </div>
      </div>
    </div>
  );
}
