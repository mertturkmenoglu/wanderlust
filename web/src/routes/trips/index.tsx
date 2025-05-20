import { ErrorComponent } from '@/components/blocks/error-component';
import { CreateDialog } from '@/components/blocks/trips/create-dialog';
import { buttonVariants } from '@/components/ui/button';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { MailsIcon, MapIcon, SearchIcon } from 'lucide-react';

export const Route = createFileRoute('/trips/')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.auth.user) {
      throw redirect({
        to: '/sign-in',
      });
    }
  },
  errorComponent: ErrorComponent,
});

function RouteComponent() {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <img
        src="/trip.png"
        className="size-64"
      />
      <h2 className="mt-8 text-4xl font-bold text-center">
        Plan your next trip with
        <br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-sky-600">
          Wanderlust
        </span>
      </h2>

      <div className="mt-16 grid grid-cols-2 gap-2 md:gap-8 max-w-md">
        <CreateDialog />

        <Link
          to="/trips/my-trips"
          className={buttonVariants({
            variant: 'ghost',
            size: 'lg',
            className: 'flex items-center gap-2',
          })}
        >
          <MapIcon className="mr-2 size-4" />
          My Trips
        </Link>

        <Link
          to="/trips/discover"
          className={buttonVariants({
            variant: 'ghost',
            size: 'lg',
            className: 'flex items-center gap-2',
          })}
        >
          <SearchIcon className="mr-2 size-4" />
          Discover
        </Link>

        <Link
          to="/trips/invites"
          className={buttonVariants({
            variant: 'ghost',
            size: 'lg',
            className: 'flex items-center gap-2',
          })}
        >
          <MailsIcon className="mr-2 size-4" />
          Invites
        </Link>
      </div>
    </div>
  );
}
