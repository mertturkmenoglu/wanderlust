import { useLoaderData } from '@tanstack/react-router';
import { addDays, eachDayOfInterval, isWithinInterval } from 'date-fns';

export function useTripDays() {
	const { trip } = useLoaderData({ from: '/trips/$id' });
	const intervalDays = eachDayOfInterval({
		start: trip.startAt,
		end: trip.endAt,
	});

	return intervalDays.map((day) => {
		const items = trip.itineraryItems.filter((loc) =>
			isWithinInterval(new Date(loc.scheduledTime), {
				start: day,
				end: addDays(day, 1),
			}),
		);

		const isDefaultOpen = items.length > 0;

		return {
			day,
			items,
			isDefaultOpen,
		};
	});
}
