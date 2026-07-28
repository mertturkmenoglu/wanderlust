import {
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@wanderlust/ui/components/dialog';
import { useMemo } from 'react';
import { useItineraryContext } from './hooks';

export function Header() {
	const ctx = useItineraryContext();

	const title = useMemo(() => {
		if (ctx.type === null) {
			return 'Add item to your trip itinerary';
		}

		if (ctx.type === 'accommodation') {
			return 'Accommodation';
		}

		if (ctx.type === 'transportation') {
			return 'Transportation';
		}

		if (ctx.type === 'event') {
			return 'Event';
		}

		if (ctx.type === 'location') {
			return 'Place';
		}

		if (ctx.type === 'dining') {
			return 'Dining';
		}

		if (ctx.type === 'other') {
			return 'Add notes';
		}

		return 'Update your trip itinerary';
	}, [ctx.type]);

	const description = useMemo(() => {
		if (ctx.type === null) {
			return 'Select the type of itinerary item you want to add. You can add multiple items of different types.';
		}

		if (ctx.type === 'accommodation') {
			return 'Add accommodation details for your trip.';
		}

		if (ctx.type === 'transportation') {
			return 'Add transportation details for your trip.';
		}

		if (ctx.type === 'event') {
			return 'Add event details for your trip.';
		}

		if (ctx.type === 'location') {
			return 'Add a place to visit during your trip.';
		}

		if (ctx.type === 'dining') {
			return 'Add dining options for your trip.';
		}

		if (ctx.type === 'other') {
			return 'Add any additional notes for your trip.';
		}

		return '';
	}, [ctx.type]);

	return (
		<DialogHeader>
			<DialogTitle>{title}</DialogTitle>
			<DialogDescription>{description}</DialogDescription>
		</DialogHeader>
	);
}
