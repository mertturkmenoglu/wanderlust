import { cn } from '@/lib/utils';
import { AuthContext } from '@/providers/auth-provider';
import { Link } from '@tanstack/react-router';
import { useContext } from 'react';
import { Menu } from './menu';
import { SignInButton } from './sign-in-button';
import { SignedInLinks } from './signed-in';

type Props = React.HTMLAttributes<HTMLElement>;

export function Header({ className, ...props }: Readonly<Props>) {
  const ctx = useContext(AuthContext);
  const isSignedIn = !ctx.isLoading && ctx.user !== null;

  return (
    <header
      className={cn(
        'max-w-7xl mt-8 flex items-center justify-between mx-auto w-full',
        className,
      )}
      {...props}
    >
      <Link
        to="/"
        className="flex items-center gap-4"
      >
        <img
          src="/logo.png"
          alt="Wanderlust"
          className="size-12 min-h-12 min-w-12"
        />
      </Link>

      {ctx.isLoading ? (
        <div className="h-8 w-16 rounded-full bg-primary animate-pulse" />
      ) : (
        <div>
          {!isSignedIn && <SignInButton />}

          {isSignedIn && ctx.user && (
            <div className="flex items-center gap-2">
              <SignedInLinks />
              <Menu auth={ctx.user} />
            </div>
          )}
        </div>
      )}
    </header>
  );
}
