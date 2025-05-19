import UserImage from '@/components/blocks/user-image';
import { buttonVariants } from '@/components/ui/button';
import { useTripIsPrivileged } from '@/hooks/use-trip-is-privileged';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';
import { cn } from '@/lib/utils';
import { getRouteApi, Link } from '@tanstack/react-router';
import { formatDate } from 'date-fns';
import {
  ActivityIcon,
  ClockFadingIcon,
  ClockIcon,
  ConciergeBellIcon,
  EyeIcon,
  PenIcon,
  ReplyIcon,
  TextQuoteIcon,
  UsersIcon,
} from 'lucide-react';

type Props = {
  className?: string;
};

export function TripInfo({ className }: Props) {
  const route = getRouteApi('/trips/$id');
  const { trip } = route.useLoaderData();
  const { auth } = route.useRouteContext();
  const isPrivileged = useTripIsPrivileged(trip, auth.user?.id ?? '');

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
        <LineItem icon={ActivityIcon} text={`Status: ${trip.status}`} />
        <LineItem icon={EyeIcon} text={`Visibility: ${trip.visibilityLevel}`} />
        <LineItem
          icon={ClockIcon}
          text={`Start Date: ${formatDate(trip.startAt, 'dd MMM yyyy')}`}
        />
        <LineItem
          icon={ClockFadingIcon}
          text={`End Date: ${formatDate(trip.endAt, 'dd MMM yyyy')}`}
        />
      </div>

      <div className="flex flex-col mt-4 text-left items-start w-full pr-2 -ml-2">
        <TripLink to="" id={trip.id} />
        <TripLink to="participants" id={trip.id} />
        <TripLink to="amenities" id={trip.id} />
        <TripLink to="comments" id={trip.id} />
        {isPrivileged && <TripLink to="edit" id={trip.id} />}
      </div>
    </div>
  );
}

type LineItemProps = {
  icon: typeof ActivityIcon;
  text: string;
};

function LineItem({ icon: Icon, text }: LineItemProps) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-4 text-primary" />
      <div className="text-sm text-muted-foreground capitalize">{text}</div>
    </div>
  );
}

type TripLinkProps = {
  to: '' | 'participants' | 'amenities' | 'comments' | 'edit';
  id: string;
};

const icons: Record<TripLinkProps['to'], typeof ActivityIcon> = {
  '': TextQuoteIcon,
  participants: UsersIcon,
  amenities: ConciergeBellIcon,
  comments: ReplyIcon,
  edit: PenIcon,
};

function TripLink({ to, id }: TripLinkProps) {
  const Icon = icons[to];
  const href = to !== '' ? `/trips/$id/${to}` : `/trips/$id`;
  return (
    <Link
      to={href}
      params={{
        id,
      }}
      className={cn(
        buttonVariants({ variant: 'ghost', size: 'sm' }),
        'w-full flex justify-start',
      )}
    >
      <Icon className="size-4" />
      <span className="capitalize">{to !== '' ? to : 'Details'}</span>
    </Link>
  );
}
