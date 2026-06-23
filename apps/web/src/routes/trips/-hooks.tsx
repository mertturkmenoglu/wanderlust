import { linkOptions } from '@tanstack/react-router';
import z from 'zod';

export const schema = z.object({
	showLocationDialog: z.boolean().optional(),
	placeId: z.string().optional(),
	isUpdate: z.boolean().optional(),
	description: z.string().optional(),
	scheduledTime: z.string().optional(),
	locId: z.string().optional(),
});

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
