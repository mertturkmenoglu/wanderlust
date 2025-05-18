import UserImage from '@/components/blocks/user-image';
import { Button } from '@/components/ui/button';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';

type Props = {
  image: string;
  name: string;
  username: string;
  role: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

export function Item({
  image,
  name,
  username,
  role,
  className,
  onClick,
}: Props) {
  return (
    <Link
      to="/u/$username"
      params={{
        username,
      }}
      className={cn('flex items-center gap-4', className)}
    >
      <UserImage
        src={ipx(userImage(image), 'w_512')}
        imgClassName="size-16"
        fallbackClassName="size-16 rounded-md"
        className="size-16 rounded-md"
      />

      <div>
        <div className="text-xl font-bold">{name}</div>
        <div className="text-xs text-primary">@{username}</div>
      </div>

      <div className="ml-auto">
        <Button
          variant="secondary"
          size="sm"
          onClick={onClick}
          disabled={onClick === undefined}
          className="capitalize"
        >
          {role}
        </Button>
      </div>
    </Link>
  );
}
