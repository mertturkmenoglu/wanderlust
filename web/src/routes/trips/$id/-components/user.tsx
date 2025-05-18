import UserImage from '@/components/blocks/user-image';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';
import { cn } from '@/lib/utils';
import { getRouteApi } from '@tanstack/react-router';
import {
  ActivityIcon,
  ClockFadingIcon,
  ClockIcon,
  EyeIcon,
  PenIcon,
  ReplyIcon,
  UsersIcon,
} from 'lucide-react';
import { AmenitiesDialog } from './amenities';

type Props = {
  className?: string;
};

export function UserColumn({ className }: Props) {
  const route = getRouteApi('/trips/$id/');
  const { trip } = route.useLoaderData();

  return (
    <div className={cn(className)}>
      <div className="text-sm text-muted-foreground">Trip Owner</div>
      <div className="flex items-center gap-4 mt-2">
        <UserImage
          src={ipx(userImage(trip.owner.profileImage), 'w_512')}
          imgClassName="size-16"
          fallbackClassName="size-16"
          className="size-16 rounded-md"
        />

        <div>
          <div className="text-xl font-bold">{trip.owner.fullName}</div>
          <div className="text-xs text-primary">@{trip.owner.username}</div>
        </div>
      </div>

      <div className="my-4 space-y-2">
        <div className="flex items-center gap-2">
          <ActivityIcon className="size-4 text-primary" />
          <div className="text-sm text-muted-foreground capitalize">
            Status: {trip.status}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <EyeIcon className="size-4 text-primary" />
          <div className="text-sm text-muted-foreground capitalize">
            Visibility: {trip.visibilityLevel}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ClockIcon className="size-4 text-primary" />
          <div className="text-sm text-muted-foreground capitalize">
            Start Date:{' '}
            {new Date(trip.startAt).toLocaleDateString('en-US', {
              dateStyle: 'medium',
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ClockFadingIcon className="size-4 text-primary" />
          <div className="text-sm text-muted-foreground capitalize">
            End Date:{' '}
            {new Date(trip.endAt).toLocaleDateString('en-US', {
              dateStyle: 'medium',
            })}
          </div>
        </div>
      </div>

      <TooltipProvider>
        <div className="flex items-center gap-4 mt-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <UsersIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Participants</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <AmenitiesDialog />
            </TooltipTrigger>
            <TooltipContent side="bottom">Requested Amenities</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <ReplyIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Comments</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <PenIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Edit</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}
