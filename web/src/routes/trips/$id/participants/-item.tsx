import UserImage from '@/components/blocks/user-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import { KeySquareIcon, Settings2Icon, UserMinusIcon } from 'lucide-react';

type Props = {
  image: string;
  name: string;
  username: string;
  role: string;
  isPrivileged: boolean;
  className?: string;
};

export function Item({
  image,
  name,
  username,
  role,
  isPrivileged,
  className,
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

      <div className="ml-auto flex items-center gap-2">
        <Badge variant="secondary" className="capitalize">
          {role}
        </Badge>
        {isPrivileged && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings2Icon className="size-4" />
                <span className="sr-only">Edit</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Manage</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="default">
                <KeySquareIcon className="size-4" />
                <span>Change Role</span>
              </DropdownMenuItem>

              <DropdownMenuItem variant="destructive">
                <UserMinusIcon className="size-4" />
                <span>Remove</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </Link>
  );
}
