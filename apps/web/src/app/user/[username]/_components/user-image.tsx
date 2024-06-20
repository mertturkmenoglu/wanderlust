import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type Props = {
  image: string | null;
  className?: string;
};

export default function UserImage({ image, className }: Props) {
  return (
    <Avatar className={cn('size-20 md:size-32', className)}>
      <AvatarImage
        src={image ?? ''}
        className="size-20 md:size-32"
      />
      <AvatarFallback>
        <Skeleton className="size-20 rounded-full md:size-32" />
      </AvatarFallback>
    </Avatar>
  );
}
