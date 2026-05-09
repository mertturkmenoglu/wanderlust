import z from 'zod';
import { $ } from '@/db/schema';
import { Pagination } from '@/lib/pagination';

const place = $.place.extend({
	assets: $.asset.array(),
	category: $.category,
	address: $.address.extend({
		city: $.city,
	}),
});

const event = $.event.extend({
	place: place.nullable(),
	assets: $.asset.array(),
	lineup: $.eventLineupItem
		.extend({
			user: $.user
				.pick({
					id: true,
					name: true,
					username: true,
					image: true,
				})
				.nullable(),
		})
		.array(),
	address: $.address.extend({
		city: $.city,
	}),
	agenda: $.eventAgendaItem.array(),
	organizer: $.user.pick({
		id: true,
		name: true,
		username: true,
		image: true,
	}),
});

export const createInput = $.event.pick({
	title: true,
	description: true,
	startsAt: true,
	endsAt: true,
	addressId: true,
	externalUrl: true,
	ageRestriction: true,
	amenities: true,
	refundPolicy: true,
	faq: true,
	placeId: true,
	isOnline: true,
	recurrence: true,
	categories: true,
});

export type CreateInput = z.infer<typeof createInput>;

export const createOutput = z.object({
	event: event,
});

export type CreateOutput = z.infer<typeof createOutput>;

export const getInput = z.object({
	id: z.string(),
});

export type GetInput = z.infer<typeof getInput>;

export const getOutput = z.object({
	event: event,
});

export type GetOutput = z.infer<typeof getOutput>;

export const listInput = Pagination.queryParamsSchema.extend({});

export type ListInput = z.infer<typeof listInput>;

export const listOutput = z.object({
	events: event.array(),
});

export type ListOutput = z.infer<typeof listOutput>;

export const updateInput = $.event
	.pick({
		id: true,
		title: true,
		description: true,
		startsAt: true,
		endsAt: true,
		addressId: true,
		externalUrl: true,
		ageRestriction: true,
		amenities: true,
		refundPolicy: true,
		faq: true,
		placeId: true,
		isOnline: true,
		recurrence: true,
		categories: true,
	})
	.partial({
		title: true,
		description: true,
		startsAt: true,
		endsAt: true,
		addressId: true,
		externalUrl: true,
		ageRestriction: true,
		amenities: true,
		refundPolicy: true,
		faq: true,
		placeId: true,
		isOnline: true,
		recurrence: true,
		categories: true,
	});

export type UpdateInput = z.infer<typeof updateInput>;

export const updateOutput = z.object({
	event: event,
});

export type UpdateOutput = z.infer<typeof updateOutput>;

export const deleteInput = $.event.pick({
	id: true,
});

export type DeleteInput = z.infer<typeof deleteInput>;

export const deleteOutput = z.object({});

export type DeleteOutput = z.infer<typeof deleteOutput>;

export const updateAmenitiesInput = z.object({
	id: $.event.shape.id,
	amenities: $.event.shape.amenities,
});

export type UpdateAmenitiesInput = z.infer<typeof updateAmenitiesInput>;

export const updateAmenitiesOutput = z.object({
	event: event,
});

export type UpdateAmenitiesOutput = z.infer<typeof updateAmenitiesOutput>;

export const updateFaqInput = z.object({
	id: $.event.shape.id,
	faq: $.event.shape.faq,
});

export type UpdateFaqInput = z.infer<typeof updateFaqInput>;

export const updateFaqOutput = z.object({
	event: event,
});

export type UpdateFaqOutput = z.infer<typeof updateFaqOutput>;

export const updateCategoriesInput = z.object({
	id: $.event.shape.id,
	categories: $.event.shape.categories,
});

export type UpdateCategoriesInput = z.infer<typeof updateCategoriesInput>;

export const updateCategoriesOutput = z.object({
	event: event,
});

export type UpdateCategoriesOutput = z.infer<typeof updateCategoriesOutput>;

export const updateTicketOptionsInput = z.object({
	id: $.event.shape.id,
	ticketOptions: $.eventTicketOption
		.pick({
			name: true,
			description: true,
			fee: true,
			currency: true,
			totalAvailability: true,
			currentAvailability: true,
		})
		.array(),
});

export type UpdateTicketOptionsInput = z.infer<typeof updateTicketOptionsInput>;

export const updateTicketOptionsOutput = z.object({
	ticketOptions: $.eventTicketOption.array(),
});

export type UpdateTicketOptionsOutput = z.infer<
	typeof updateTicketOptionsOutput
>;

export const updateAgendaInput = z.object({
	id: $.event.shape.id,
	agenda: $.eventAgendaItem
		.pick({
			startsAt: true,
			endsAt: true,
			title: true,
			description: true,
		})
		.array(),
});

export type UpdateAgendaInput = z.infer<typeof updateAgendaInput>;

export const updateAgendaOutput = z.object({
	agenda: $.eventAgendaItem.array(),
});

export type UpdateAgendaOutput = z.infer<typeof updateAgendaOutput>;

export const updateLineupInput = z.object({
	id: $.event.shape.id,
	lineup: $.eventLineupItem
		.pick({
			name: true,
			userId: true,
			badge: true,
			title: true,
			description: true,
			order: true,
		})
		.array(),
});

export type UpdateLineupInput = z.infer<typeof updateLineupInput>;

export const updateLineupOutput = z.object({
	lineup: $.eventLineupItem.array(),
});

export type UpdateLineupOutput = z.infer<typeof updateLineupOutput>;

export const createAssetInput = z.object({
	eventId: $.event.shape.id,
	url: $.asset.shape.url,
	description: $.asset.shape.description.optional(),
	order: $.asset.shape.order.optional(),
});

export type CreateAssetInput = z.infer<typeof createAssetInput>;

export const createAssetOutput = z.object({
	asset: $.asset,
});

export type CreateAssetOutput = z.infer<typeof createAssetOutput>;

export const updateAssetsInput = z.object({
	eventId: $.event.shape.id,
	assets: $.asset
		.pick({
			url: true,
			description: true,
			order: true,
		})
		.partial({
			description: true,
			order: true,
		})
		.array(),
});

export type UpdateAssetsInput = z.infer<typeof updateAssetsInput>;

export const updateAssetsOutput = z.object({
	assets: $.asset.array(),
});

export type UpdateAssetsOutput = z.infer<typeof updateAssetsOutput>;

export const deleteAssetInput = $.asset.pick({
	id: true,
});

export type DeleteAssetInput = z.infer<typeof deleteAssetInput>;

export const deleteAssetOutput = z.object({});

export type DeleteAssetOutput = z.infer<typeof deleteAssetOutput>;

export const addToInterestedEventsInput = $.event.pick({
	id: true,
});

export type AddToInterestedEventsInput = z.infer<
	typeof addToInterestedEventsInput
>;

export const addToInterestedEventsOutput = z.object({});

export type AddToInterestedEventsOutput = z.infer<
	typeof addToInterestedEventsOutput
>;

export const listMyInterestedEventsInput = Pagination.queryParamsSchema.extend(
	{},
);

export type ListMyInterestedEventsInput = z.infer<
	typeof listMyInterestedEventsInput
>;

export const listMyInterestedEventsOutput = z.object({
	events: event.array(),
	pagination: Pagination.schema,
});

export type ListMyInterestedEventsOutput = z.infer<
	typeof listMyInterestedEventsOutput
>;

export const deleteFromMyInterestedEventsInput = $.event.pick({
	id: true,
});

export type DeleteFromMyInterestedEventsInput = z.infer<
	typeof deleteFromMyInterestedEventsInput
>;

export const deleteFromMyInterestedEventsOutput = z.object({});

export type DeleteFromMyInterestedEventsOutput = z.infer<
	typeof deleteFromMyInterestedEventsOutput
>;

export const listByPlaceIdInput = Pagination.queryParamsSchema.extend({
	placeId: $.place.shape.id,
});

export type ListByPlaceIdInput = z.infer<typeof listByPlaceIdInput>;

export const listByPlaceIdOutput = z.object({
	events: event.array(),
	pagination: Pagination.schema,
});

export type ListByPlaceIdOutput = z.infer<typeof listByPlaceIdOutput>;

export const listByOrganizerIdInput = Pagination.queryParamsSchema.extend({
	organizerId: $.user.shape.id,
});

export type ListByOrganizerIdInput = z.infer<typeof listByOrganizerIdInput>;

export const listByOrganizerIdOutput = z.object({
	events: event.array(),
	pagination: Pagination.schema,
});

export type ListByOrganizerIdOutput = z.infer<typeof listByOrganizerIdOutput>;

export const listInterestedFriendsInput = Pagination.queryParamsSchema.extend({
	eventId: $.event.shape.id,
});

export type ListInterestedFriendsInput = z.infer<
	typeof listInterestedFriendsInput
>;

export const listInterestedFriendsOutput = z.object({
	users: $.user
		.pick({
			id: true,
			name: true,
			username: true,
			image: true,
		})
		.array(),
	pagination: Pagination.schema,
});

export type ListInterestedFriendsOutput = z.infer<
	typeof listInterestedFriendsOutput
>;
