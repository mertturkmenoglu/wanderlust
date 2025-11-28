// oxlint-disable no-nested-ternary
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { components } from '@/lib/api-types';
import { AuthContext } from '@/providers/auth-provider';
import { Link } from '@tanstack/react-router';
import { GlobeIcon, LockIcon, UsersIcon } from 'lucide-react';
import { useContext } from 'react';

type Props = {
  trip: components['schemas']['Trip'];
};

export function TripCard({ trip }: Props) {
  const auth = useContext(AuthContext);
  const isOwner = trip.ownerId === auth.user?.id;
  const ownerName = isOwner ? 'you' : `@${trip.owner.username}`;

  return (
    <Link
      to="/trips/$id"
      params={{
        id: trip.id,
      }}
      className="flex items-center gap-4 p-2 hover:bg-primary/5 rounded justify-between"
    >
      <div>
        <div className="text-sm text-primary">{trip.title}</div>
        <div className="flex items-center gap-4">
          <div className="text-xs text-muted-foreground mt-1">
            Created at {new Date(trip.createdAt).toLocaleDateString()} by{' '}
            <span className="text-primary">{ownerName}</span>
          </div>
        </div>
      </div>
      <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {trip.visibilityLevel === 'public' ? (
                <GlobeIcon className="size-5 text-primary" />
              ) : trip.visibilityLevel === 'friends' ? (
                <UsersIcon className="size-5 text-primary" />
              ) : (
                <LockIcon className="size-5 text-primary" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {trip.visibilityLevel === 'public'
                  ? 'Everyone can see this trip'
                  : trip.visibilityLevel === 'friends'
                    ? 'Only participants can see this trip'
                    : 'Only you can see this trip'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Link>
  );
}
