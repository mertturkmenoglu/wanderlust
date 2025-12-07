import { getRouteApi, Link } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import { cn } from '@wanderlust/ui/lib/utils';
import { formatDate } from 'date-fns';
import {
	ActivityIcon,
	ClockFadingIcon,
	ClockIcon,
	ConciergeBellIcon,
	EyeIcon,
	ReplyIcon,
	Settings2Icon,
	TextQuoteIcon,
	UsersIcon,
} from 'lucide-react';
import { UserImage } from '@/components/user-image';
import { useTripIsPrivileged } from '@/hooks/use-trip-is-privileged';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';

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
			<div className="text-muted-foreground text-sm">Trip Owner</div>
			<div className="mt-2 flex items-center gap-4">
				<UserImage
					src={ipx(userImage(trip.owner.image), 'w_512')}
					imgClassName="size-16"
					fallbackClassName="size-16"
					className="size-16 rounded-md"
				/>

				<div>
					<div className="font-bold text-xl">{trip.owner.name}</div>
					<div className="text-primary text-xs">@{trip.owner.username}</div>
				</div>
			</div>

			<div className="my-4 space-y-2">
				<LineItem
					icon={ActivityIcon}
					text={`Status: ${trip.startAt.getTime() > Date.now() ? 'Upcoming' : 'Completed'}`}
				/>
				<LineItem icon={EyeIcon} text={`Visibility: ${trip.visibilityLevel}`} />
				<LineItem
					icon={ClockIcon}
					text={`Start Date: ${formatDate(trip.startAt, 'dd MMM yyyy')}`}
					title={trip.startAt.toISOString()}
				/>
				<LineItem
					icon={ClockFadingIcon}
					text={`End Date: ${formatDate(trip.endAt, 'dd MMM yyyy')}`}
					title={trip.endAt.toISOString()}
				/>
			</div>

			<div className="-ml-2 mt-4 flex w-full flex-col items-start pr-2 text-left">
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
	title?: string;
};

function LineItem({ icon: Icon, text, title }: LineItemProps) {
	return (
		<div className="flex items-center gap-2">
			<Icon className="size-4 text-primary" />
			<div className="text-muted-foreground text-sm capitalize" title={title}>
				{text}
			</div>
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
	edit: Settings2Icon,
};

function TripLink({ to, id }: TripLinkProps) {
	const Icon = icons[to];
	const href = to === '' ? '/trips/$id' : `/trips/$id/${to}`;

	return (
		<Link
			to={href}
			params={{
				id,
			}}
			className={cn(
				buttonVariants({ variant: 'ghost', size: 'sm' }),
				'flex w-full justify-start',
			)}
		>
			<Icon className="size-4" />
			<span className="capitalize">{to === '' ? 'Details' : to}</span>
		</Link>
	);
}
