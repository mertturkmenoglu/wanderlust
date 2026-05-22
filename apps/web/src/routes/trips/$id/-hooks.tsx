import { linkOptions, useLoaderData } from '@tanstack/react-router';
import { formatDistanceToNow, isBefore } from 'date-fns';
import {
	BookTextIcon,
	Building2Icon,
	Calendar1Icon,
	ClockFadingIcon,
	ImagesIcon,
	MapPinIcon,
	MessageCircleIcon,
	Users2Icon,
} from 'lucide-react';
import type { SummaryCardProps } from './-summary-card';

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
				to: '/trips/$id/details',
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
				to: '/trips/$id/details',
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
				to: '/trips/$id/details',
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
		{
			title: 'Itinerary Items',
			value: data.totalItineraryItems,
			color: 'text-cyan-600',
			icon: BookTextIcon,
			explain: 'Organize bookings & documents',
			link: linkOptions({
				to: '/trips/$id/itinerary',
				params: {
					id: data.trip.id,
				},
			}),
		},
		{
			title: 'Media',
			value: data.totalAssets,
			color: 'text-fuchsia-600',
			icon: ImagesIcon,
			explain: data.totalAssets === 0 ? 'Add images' : 'Browse media',
			link: linkOptions({
				to: '/trips/$id/media',
				params: {
					id: data.trip.id,
				},
			}),
		},
	];

	return items;
}
