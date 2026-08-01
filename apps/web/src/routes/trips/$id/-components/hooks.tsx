import { linkOptions, useLoaderData } from '@tanstack/react-router';
import { formatDistanceToNow, isBefore } from 'date-fns';
import {
	Building2Icon,
	Calendar1Icon,
	ClockFadingIcon,
	MapPinIcon,
	MessageCircleIcon,
	Users2Icon,
} from 'lucide-react';
import { useMemo } from 'react';
import type { Outputs } from '@/lib/orpc';
import type { SummaryCardProps } from './summary-card';

type City = Outputs['cities']['get']['city'];

export function useTripSummary() {
	const data = useLoaderData({ from: '/trips/$id/' });
	const isBeforeStart = isBefore(new Date(), data.trip.startAt);
	const isAfterEnd = isBefore(data.trip.endAt, new Date());
	const isOngoing = !isBeforeStart && !isAfterEnd;
	const title = isOngoing ? 'Started' : isBeforeStart ? 'Starts' : 'Ended';

	const items: SummaryCardProps[] = [
		{
			title: title,
			value: formatDistanceToNow(data.trip.startAt, { addSuffix: true }),
			color: 'text-yellow-600',
			icon: ClockFadingIcon,
			explain: isOngoing
				? 'See details'
				: isBeforeStart
					? 'Plan final details'
					: 'See details',
			link: linkOptions({
				to: '/trips/$id/itinerary',
				params: {
					id: data.trip.id,
				},
			}),
		},
		{
			title: 'Cities',
			value: data.totalCities,
			color: 'text-emerald-600',
			icon: Building2Icon,
			explain: 'Check your stops',
			link: linkOptions({
				to: '.',
				hash: '#cities',
			}),
		},
		{
			title: 'Days',
			value: data.totalDays,
			color: 'text-lime-600',
			icon: Calendar1Icon,
			explain: 'View agenda for each day',
			link: linkOptions({
				to: '/trips/$id/itinerary',
				params: {
					id: data.trip.id,
				},
			}),
		},
		{
			title: 'Participants',
			value: data.totalParticipants,
			color: 'text-sky-600',
			icon: Users2Icon,
			explain:
				data.totalParticipants <= 1
					? 'Invite participants'
					: 'See participants',
			link: linkOptions({
				to: '/trips/$id/participants',
				params: {
					id: data.trip.id,
				},
			}),
		},
		{
			title: 'Locations',
			value: data.totalLocations,
			color: 'text-teal-600',
			icon: MapPinIcon,
			explain:
				data.totalLocations === 0
					? 'Add locations'
					: 'See locations on the map',
			link: linkOptions({
				to: '/trips/$id/itinerary',
				params: {
					id: data.trip.id,
				},
			}),
		},
		{
			title: 'Comments',
			value: data.totalComments,
			color: 'text-rose-500',
			icon: MessageCircleIcon,
			explain:
				data.totalComments === 0 ? 'Start a discussion' : 'Join the discussion',
			link: linkOptions({
				to: '/trips/$id/comments',
				params: {
					id: data.trip.id,
				},
			}),
		},
	];

	return items;
}

export function useTripCities() {
	const data = useLoaderData({ from: '/trips/$id/' });
	const cities = useMemo(() => {
		const items = data.trip.itineraryItems;
		const cities: City[] = [];

		for (const item of items) {
			if (
				item.place?.place?.city &&
				!cities.find((c) => c.id === item.place?.place?.city.id)
			) {
				cities.push(item.place.place.city);
			}
		}

		return cities.toSorted((a, b) => a.name.localeCompare(b.name));
	}, [data.trip.itineraryItems]);

	return cities;
}

export function useTripPlaces() {
	const data = useLoaderData({ from: '/trips/$id/' });
	const places = useMemo(() => {
		const items = data.trip.itineraryItems.toSorted(
			(a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime(),
		);
		const places: Outputs['places']['get']['place'][] = [];

		for (const item of items) {
			if (
				item.place?.place &&
				!places.find((p) => p.id === item.place?.place?.id)
			) {
				places.push(item.place.place);
			}
		}

		return places;
	}, [data.trip.itineraryItems]);

	return places;
}
