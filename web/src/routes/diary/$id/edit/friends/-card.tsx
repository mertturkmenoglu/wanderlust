import { UserImage } from '@/components/blocks/user-image';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  image: string | null;
  fullName: string;
  username: string;
};

export function UserCard({ image, fullName, username, className }: Props) {
  return (
    <Card className={cn('flex gap-4 p-4 flex-row items-center', className)}>
      <UserImage
        src={image ?? '/profile.png'}
        imgClassName="size-16"
        fallbackClassName="size-16"
        className="size-16 rounded-md"
      />

      <div>
        <div className="line-clamp-1 text-sm capitalize">{fullName}</div>
        <div className="my-1 text-xs text-muted-foreground">@{username}</div>
      </div>
    </Card>
  );
}
