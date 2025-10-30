import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AuthContext } from '@/providers/auth-provider';
import { Link, useLoaderData } from '@tanstack/react-router';
import { format } from 'date-fns';
import {
  ImagesIcon,
  MapPinIcon,
  QuoteIcon,
  Settings2Icon,
  Users2Icon,
} from 'lucide-react';
import { useContext, type PropsWithChildren } from 'react';

type Props = {
  className?: string;
};

export function InfoColumn({ className }: Props) {
  const { diary } = useLoaderData({
    from: '/diary/$id/',
  });

  const auth = useContext(AuthContext);
  const isOwner = auth.user?.id === diary.userId;

  return (
    <div className={cn('flex flex-col', className)}>
      <Avatar className="size-16 mx-auto">
        <AvatarImage src={diary.user.profileImage || undefined} />
        <AvatarFallback>{diary.user.fullName.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="text-lg text-center line-clamp-1 mt-4">
        {diary.user.fullName}
      </div>
      <div className="text-sm text-primary text-center line-clamp-1">
        @{diary.user.username}
      </div>
      <div className="mt-4 text-sm text-center text-muted-foreground">
        {format(diary.date, 'PPP')}
      </div>

      <div className="flex flex-col space-y-2 mt-4">
        <NavLink to=".">
          <QuoteIcon className="size-4" />
          <span>Description</span>
        </NavLink>

        <NavLink to=".">
          <MapPinIcon className="size-4" />
          <span>Locations</span>
        </NavLink>

        <NavLink to=".">
          <Users2Icon className="size-4" />
          <span>Friends</span>
        </NavLink>

        <NavLink to=".">
          <ImagesIcon className="size-4" />
          <span>Media</span>
        </NavLink>

        {isOwner && (
          <NavLink to=".">
            <Settings2Icon className="size-4" />
            <span>Edit</span>
          </NavLink>
        )}
      </div>
    </div>
  );
}

type NavLinkProps = PropsWithChildren<{
  to: string;
}>;

function NavLink({ children, to }: NavLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        'justify-start!',
        buttonVariants({ variant: 'ghost', size: 'sm' }),
      )}
    >
      {children}
    </Link>
  );
}
