import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';

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
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    compactDisplay: 'short',
    notation: 'compact',
  });

  return (
    <div className={cn('mt-4 flex items-center gap-2', className)}>
      <Button
        variant="ghost"
        asChild
      >
        <Link
          to="/u/$username/followers"
          params={{
            username,
          }}
        >
          <span>{formatter.format(followersCount)}</span>
          <span className="ml-1">Followers</span>
        </Link>
      </Button>

      <Button
        variant="ghost"
        asChild
      >
        <Link
          to="/u/$username/following"
          params={{
            username,
          }}
        >
          <span>{formatter.format(followingCount)}</span>
          <span className="ml-1">Following</span>
        </Link>
      </Button>
    </div>
  );
}
