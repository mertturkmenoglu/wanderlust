import { Link, useLoaderData } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { format, formatDistanceToNow } from 'date-fns';
import { BackLink } from '@/components/back-link';

export function Header() {
	const { trip } = useLoaderData({ from: '/trips/$id' });

	return (
		<>
			<BackLink href="/trips/my-trips" text="Go back to my trips" />

			<Item className="mt-4 p-0!">
				<ItemContent>
					<ItemTitle className="md:text-2xl">{trip.title}</ItemTitle>
					<ItemDescription className="text-xs md:text-sm">
						{format(trip.startAt, 'LLL do p')} -{' '}
						{format(trip.endAt, 'LLL do p')}
					</ItemDescription>
					<ItemDescription className="text-xs md:text-sm">
						Last updated:{' '}
						{formatDistanceToNow(trip.updatedAt, { addSuffix: true })} by{' '}
						<Link
							to="/u/$username"
							params={{
								username: trip.owner.username,
							}}
							className={buttonVariants({
								variant: 'link',
								className: 'px-0!',
							})}
						>
							{trip.owner.name}
						</Link>
					</ItemDescription>
				</ItemContent>
			</Item>
		</>
	);
}
