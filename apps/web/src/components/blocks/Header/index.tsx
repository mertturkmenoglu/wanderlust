import Logo from '@/app/icon.png';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { Calendar, MapPin, UserIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import MenuContent from './menu-content';
import Notifications from './notifications';

type Props = React.HTMLAttributes<HTMLElement>;

async function Header({ className, ...props }: Props) {
  const user = await currentUser();

  return (
    <header
      className={cn('container flex items-center justify-between', className)}
      {...props}
    >
      <Link href="/">
        <Image
          src={Logo}
          alt="Wanderlust"
          className="size-12 min-h-12 min-w-12"
        />
      </Link>

      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link
              href="/discover/locations"
              className="flex items-center gap-2 rounded-full px-4 py-2 hover:bg-muted"
            >
              <MapPin className="size-6" />
              <span className="hidden sm:block">Locations</span>
            </Link>
          </li>
          <li>
            <Link
              href="/discover/events"
              className="flex items-center gap-2 rounded-full px-4 py-2 hover:bg-muted"
            >
              <Calendar className="size-6" />
              <span className="hidden sm:block">Events</span>
            </Link>
          </li>
        </ul>
      </nav>

      <ClerkLoading>
        <div className="flex items-center gap-4">
          <Skeleton className="size-8 rounded-full bg-muted" />
          <Skeleton className="size-8 rounded-full bg-muted px-10" />
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <SignedOut>
          <SignInButton>
            <Button
              variant="default"
              className="rounded-full"
            >
              Sign in
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className="flex items-center gap-2">
            <Notifications />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="rounded-full"
                  variant="ghost"
                >
                  <UserIcon className="size-5 text-black" />
                  <span className="hidden sm:ml-2 sm:block">
                    {user?.firstName}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <MenuContent
                fullName={user?.fullName ?? ''}
                username={user?.username ?? ''}
              />
            </DropdownMenu>
          </div>
        </SignedIn>
      </ClerkLoaded>
    </header>
  );
}

export default Header;
