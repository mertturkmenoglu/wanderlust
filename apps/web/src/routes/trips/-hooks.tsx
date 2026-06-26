import { linkOptions } from '@tanstack/react-router';

export function useTabs(id: string) {
	return [
		linkOptions({
			to: '/trips/$id',
			params: { id },
			title: 'Summary',
		}),
		linkOptions({
			to: '/trips/$id/details',
			params: { id },
			title: 'Details',
		}),
		linkOptions({
			to: '/trips/$id/itinerary',
			params: { id },
			title: 'Itinerary',
		}),
		linkOptions({
			to: '/trips/$id/media',
			params: { id },
			title: 'Media',
		}),
		linkOptions({
			to: '/trips/$id/participants',
			params: { id },
			title: 'Participants',
		}),
		linkOptions({
			to: '/trips/$id/amenities',
			params: { id },
			title: 'Amenities',
		}),
		linkOptions({
			to: '/trips/$id/comments',
			params: { id },
			title: 'Comments',
		}),
		linkOptions({
			to: '/trips/$id/edit',
			params: { id },
			title: 'Edit',
		}),
	];
}
