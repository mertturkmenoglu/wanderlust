import { Link, linkOptions, useLoaderData } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { BackLink } from '@/components/back-link';
import { RelativeTime } from '@/components/relative-time';
import { useTripTimeFormatter } from './-hooks';

export function Header() {
	const { trip } = useLoaderData({ from: '/trips/$id' });
	const format = useTripTimeFormatter();

	return (
		<>
			<BackLink
				link={linkOptions({
					to: '/trips/my-trips',
				})}
				text="Go back to my trips"
			/>

			<Item className="mt-4 p-0!">
				<ItemContent>
					<ItemTitle className="md:text-2xl">{trip.title}</ItemTitle>
					<ItemDescription className="text-xs md:text-sm">
						{format(trip.startAt)} - {format(trip.endAt)}
					</ItemDescription>
					<ItemDescription className="text-xs md:text-sm">
						Last updated: <RelativeTime date={trip.updatedAt} /> by{' '}
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
