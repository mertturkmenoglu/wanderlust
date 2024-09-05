import Logo from '@/app/icon.png';
import { getAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Menu from './menu';
import SignInButton from './sign-in-button';
import SignedInLinks from './signed-in';

type Props = React.HTMLAttributes<HTMLElement>;

export default async function Header({ className, ...props }: Readonly<Props>) {
  const auth = await getAuth();
  const isSignedIn = auth !== null;

  return (
    <header
      className={cn(
        'container mt-8 flex items-center justify-between',
        className
      )}
      {...props}
    >
      <Link
        href="/"
        className="flex items-center gap-4"
      >
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

      {!isSignedIn && <SignInButton />}

      {isSignedIn && (
        <div className="flex items-center gap-2">
          <SignedInLinks city={null} />
          <Menu auth={auth} />
        </div>
      )}
    </header>
  );
}
