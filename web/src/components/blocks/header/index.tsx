import Logo from '@/app/icon.png';
import { getAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';
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

        <div className="text-xl">Wanderlust</div>
      </Link>

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
