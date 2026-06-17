import { Link, useLoaderData } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import { ScrollArea, ScrollBar } from '@wanderlust/ui/components/scroll-area';
import { MapIcon } from 'lucide-react';
import { UnderlineLink } from '@/components/underline-link';
import { useListTripsQuery } from './hooks';

export function AddToTripView() {
	const { place } = useLoaderData({ from: '/p/$id/' });
	const query = useListTripsQuery();
	const trips = query.data.trips;

	if (trips.length === 0) {
		return (
			<div className="col-span-full flex h-full w-full flex-col items-center justify-center gap-4">
				<MapIcon className="size-6 text-muted-foreground" />
				<span className="text-muted-foreground">
					No trips found. Create a new trip first.
				</span>
				<Link
					to="/trips"
					search={{
						showNewDialog: true,
					}}
					className={buttonVariants()}
				>
					Create New Trip
				</Link>
			</div>
		);
	}

	return (
		<ScrollArea className="h-96 gap-2 pr-2">
			<div className="flex flex-col gap-2">
				{trips.map((trip) => (
					<UnderlineLink
						key={trip.id}
						to="/trips/$id"
						params={{ id: trip.id }}
						search={{
							isUpdate: false,
							placeId: place.id,
							showLocationDialog: true,
							description: `Trip to ${place.name}`,
						}}
						className="justify-start"
					>
						{trip.title}
					</UnderlineLink>
				))}
			</div>
			<ScrollBar />
		</ScrollArea>
	);
}
