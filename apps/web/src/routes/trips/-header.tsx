import { useLoaderData } from '@tanstack/react-router';
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { BackLink } from '@/components/back-link';
import { RelativeTime } from '@/components/relative-time';
import { TSTZDisplay } from '@/components/tstz-display';
import { UnderlineLink } from '@/components/underline-link';

export function Header() {
	const { trip } = useLoaderData({ from: '/trips/$id' });

	return (
		<>
			<BackLink to="/trips/my-trips" text="Go back to my trips" />

			<Item className="mt-4 p-0!">
				<ItemContent>
					<ItemTitle className="text-lg md:text-2xl">{trip.title}</ItemTitle>
					<ItemDescription className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
						<TSTZDisplay date={trip.startAt} />
						<span className="hidden md:mx-1 md:block">-</span>
						<TSTZDisplay date={trip.endAt} />
					</ItemDescription>
					<ItemDescription className="text-xs md:text-sm">
						Last updated: <RelativeTime date={trip.updatedAt} /> by{' '}
						<UnderlineLink
							to="/u/$username"
							params={{ username: trip.owner.username }}
						>
							{trip.owner.name}
						</UnderlineLink>
					</ItemDescription>
				</ItemContent>
			</Item>
		</>
	);
}
