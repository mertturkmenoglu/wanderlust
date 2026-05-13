import { $dto } from '@wanderlust/common';
import z from 'zod';
import { Pagination } from '@/lib/pagination';

const place = $dto.place.extend({
	assets: $dto.asset.array(),
	category: $dto.category,
	address: $dto.address.extend({
		city: $dto.city,
	}),
});

const event = $dto.event.extend({
	place: place.nullable(),
	assets: $dto.asset.array(),
	ticketOptions: $dto.eventTicketOption.array(),
	lineup: $dto.eventLineupItem
		.extend({
			user: $dto.user
				.pick({
					id: true,
					name: true,
					username: true,
					image: true,
				})
				.nullable(),
		})
		.array(),
	address: $dto.address.extend({
		city: $dto.city,
	}),
	agenda: $dto.eventAgendaItem.array(),
	organizer: $dto.user.pick({
		id: true,
		name: true,
		username: true,
		image: true,
	}),
});

export const createInput = $dto.event
	.pick({
		title: true,
		description: true,
		startsAt: true,
		endsAt: true,
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
	.extend({
		address: z.object({
			cityId: z.number().int().positive(),
			line1: z.string().min(1),
			line2: z.string().min(1).optional(),
			postalCode: z.string().min(1).optional(),
		}),
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
	pagination: Pagination.schema,
});

export type ListOutput = z.infer<typeof listOutput>;

export const updateInput = $dto.event
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

export const deleteInput = $dto.event.pick({
	id: true,
});

export type DeleteInput = z.infer<typeof deleteInput>;

export const deleteOutput = z.object({});

export type DeleteOutput = z.infer<typeof deleteOutput>;

export const updateAmenitiesInput = z.object({
	id: $dto.event.shape.id,
	amenities: $dto.event.shape.amenities,
});

export type UpdateAmenitiesInput = z.infer<typeof updateAmenitiesInput>;

export const updateAmenitiesOutput = z.object({
	event: event,
});

export type UpdateAmenitiesOutput = z.infer<typeof updateAmenitiesOutput>;

export const updateFaqInput = z.object({
	id: $dto.event.shape.id,
	faq: $dto.event.shape.faq,
});

export type UpdateFaqInput = z.infer<typeof updateFaqInput>;

export const updateFaqOutput = z.object({
	event: event,
});

export type UpdateFaqOutput = z.infer<typeof updateFaqOutput>;

export const updateCategoriesInput = z.object({
	id: $dto.event.shape.id,
	categories: $dto.event.shape.categories,
});

export type UpdateCategoriesInput = z.infer<typeof updateCategoriesInput>;

export const updateCategoriesOutput = z.object({
	event: event,
});

export type UpdateCategoriesOutput = z.infer<typeof updateCategoriesOutput>;

export const updateTicketOptionsInput = z.object({
	id: $dto.event.shape.id,
	ticketOptions: $dto.eventTicketOption
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
	ticketOptions: $dto.eventTicketOption.array(),
});

export type UpdateTicketOptionsOutput = z.infer<
	typeof updateTicketOptionsOutput
>;

export const updateAgendaInput = z.object({
	id: $dto.event.shape.id,
	agenda: $dto.eventAgendaItem
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
	agenda: $dto.eventAgendaItem.array(),
});

export type UpdateAgendaOutput = z.infer<typeof updateAgendaOutput>;

export const updateLineupInput = z.object({
	id: $dto.event.shape.id,
	lineup: $dto.eventLineupItem
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
	lineup: $dto.eventLineupItem.array(),
});

export type UpdateLineupOutput = z.infer<typeof updateLineupOutput>;

export const createAssetInput = z.object({
	id: $dto.event.shape.id,
	url: $dto.asset.shape.url,
	description: $dto.asset.shape.description.optional(),
	order: $dto.asset.shape.order.optional(),
});

export type CreateAssetInput = z.infer<typeof createAssetInput>;

export const createAssetOutput = z.object({
	asset: $dto.asset,
});

export type CreateAssetOutput = z.infer<typeof createAssetOutput>;

export const updateAssetsInput = z.object({
	id: $dto.event.shape.id,
	assets: $dto.asset
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
	assets: $dto.asset.array(),
});

export type UpdateAssetsOutput = z.infer<typeof updateAssetsOutput>;

export const deleteAssetInput = z.object({
	id: $dto.event.shape.id,
	assetId: $dto.asset.shape.id,
});

export type DeleteAssetInput = z.infer<typeof deleteAssetInput>;

export const deleteAssetOutput = z.object({});

export type DeleteAssetOutput = z.infer<typeof deleteAssetOutput>;

export const addToInterestedEventsInput = $dto.event.pick({
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

export const deleteFromMyInterestedEventsInput = $dto.event.pick({
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
	placeId: $dto.place.shape.id,
});

export type ListByPlaceIdInput = z.infer<typeof listByPlaceIdInput>;

export const listByPlaceIdOutput = z.object({
	events: event.array(),
	pagination: Pagination.schema,
});

export type ListByPlaceIdOutput = z.infer<typeof listByPlaceIdOutput>;

export const listByOrganizerIdInput = Pagination.queryParamsSchema.extend({
	userId: $dto.user.shape.id,
});

export type ListByOrganizerIdInput = z.infer<typeof listByOrganizerIdInput>;

export const listByOrganizerIdOutput = z.object({
	events: event.array(),
	pagination: Pagination.schema,
});

export type ListByOrganizerIdOutput = z.infer<typeof listByOrganizerIdOutput>;

export const listInterestedFriendsInput = Pagination.queryParamsSchema.extend({
	id: $dto.event.shape.id,
});

export type ListInterestedFriendsInput = z.infer<
	typeof listInterestedFriendsInput
>;

export const listInterestedFriendsOutput = z.object({
	users: $dto.user
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
