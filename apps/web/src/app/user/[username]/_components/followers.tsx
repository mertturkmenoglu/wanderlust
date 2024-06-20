import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type Props = {
  username: string;
  followersCount: number;
  followingCount: number;
  className?: string;
};

export default function Followers({
  username,
  followersCount,
  followingCount,
  className,
}: Props) {
  return (
    <div className={cn('mt-4 flex items-center gap-2', className)}>
      <Button
        variant="ghost"
        asChild
      >
        <Link href={`/user/${username}/followers`}>
          <span>{followersCount}</span>
          <span className="ml-1">Followers</span>
        </Link>
      </Button>

      <Button
        variant="ghost"
        asChild
      >
        <Link href={`/user/${username}/following`}>
          <span>{followingCount}</span>
          <span className="ml-1">Following</span>
        </Link>
      </Button>
    </div>
  );
}
