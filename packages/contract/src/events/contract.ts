import { oc } from '@orpc/contract';
import * as dto from './dto';

export const contract = {
	create: oc
		.input(dto.createInput)
		.output(dto.createOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			method: 'POST',
			path: '/events',
			summary: 'Create Event',
			description: 'Create a new event.',
			successStatus: 201,
			successDescription: 'Created',
			tags: ['Events'],
		}),
	get: oc
		.input(dto.getInput)
		.output(dto.getOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			method: 'GET',
			path: '/events/:id',
			summary: 'Get Event',
			description: 'Get an event by ID.',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Events'],
		}),
	list: oc
		.input(dto.listInput)
		.output(dto.listOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			method: 'GET',
			path: '/events',
			summary: 'List Events',
			description: 'List all events.',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Events'],
		}),
	update: oc
		.input(dto.updateInput)
		.output(dto.updateOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			method: 'PATCH',
			path: '/events/:id',
			summary: 'Update Event',
			description: 'Update an existing event.',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Events'],
		}),
	delete: oc
		.input(dto.deleteInput)
		.output(dto.deleteOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			method: 'DELETE',
			path: '/events/:id',
			summary: 'Delete Event',
			description: 'Delete an event by ID.',
			successStatus: 204,
			successDescription: 'No Content',
			tags: ['Events'],
		}),
	updateAmenities: oc
		.input(dto.updateAmenitiesInput)
		.output(dto.updateAmenitiesOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			method: 'PATCH',
			path: '/events/:id/amenities',
			summary: 'Update Event Amenities',
			description: 'Update the amenities of an existing event.',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Events'],
		}),
	updateFaq: oc
		.input(dto.updateFaqInput)
		.output(dto.updateFaqOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			method: 'PATCH',
			path: '/events/:id/faq',
			summary: 'Update Event FAQ',
			description: 'Update the FAQ of an existing event.',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Events'],
		}),
	updateCategories: oc
		.input(dto.updateCategoriesInput)
		.output(dto.updateCategoriesOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			method: 'PATCH',
			path: '/events/:id/categories',
			summary: 'Update Event Categories',
			description: 'Update the categories of an existing event.',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Events'],
		}),
	updateTicketOptions: oc
		.input(dto.updateTicketOptionsInput)
		.output(dto.updateTicketOptionsOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			method: 'PATCH',
			path: '/events/:id/ticket-options',
			summary: 'Update Event Ticket Options',
			description: 'Update the ticket options of an existing event.',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Events'],
		}),
	updateAgenda: oc
		.input(dto.updateAgendaInput)
		.output(dto.updateAgendaOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			method: 'PATCH',
			path: '/events/:id/agenda',
			summary: 'Update Event Agenda',
			description: 'Update the agenda of an existing event.',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Events'],
		}),
	updateLineup: oc
		.input(dto.updateLineupInput)
		.output(dto.updateLineupOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			method: 'PATCH',
			path: '/events/:id/lineup',
			summary: 'Update Event Lineup',
			description: 'Update the lineup of an existing event.',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Events'],
		}),
	createAsset: oc
		.input(dto.createAssetInput)
		.output(dto.createAssetOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			method: 'POST',
			path: '/events/:id/assets',
			summary: 'Create Event Asset',
			description: 'Create a new asset for an existing event.',
			successStatus: 201,
			successDescription: 'Created',
			tags: ['Events'],
		}),
	updateAssets: oc
		.input(dto.updateAssetsInput)
		.output(dto.updateAssetsOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			method: 'PATCH',
			path: '/events/:id/assets',
			summary: 'Update Event Assets',
			description: 'Update assets for an existing event.',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Events'],
		}),
	deleteAsset: oc
		.input(dto.deleteAssetInput)
		.output(dto.deleteAssetOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			method: 'DELETE',
			path: '/events/:id/assets/:assetId',
			summary: 'Delete Event Asset',
			description: 'Delete an asset from an existing event.',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Events'],
		}),
	addToInterestedEvents: oc
		.input(dto.addToInterestedEventsInput)
		.output(dto.addToInterestedEventsOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			method: 'POST',
			path: '/events/interested',
			summary: 'Add to Interested Events',
			description: "Add an event to the user's interested events list.",
			successStatus: 201,
			successDescription: 'Created',
			tags: ['Events'],
		}),
	listMyInterestedEvents: oc
		.input(dto.listMyInterestedEventsInput)
		.output(dto.listMyInterestedEventsOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			method: 'GET',
			path: '/events/interested',
			summary: 'List My Interested Events',
			description: 'List events that the user is interested in.',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Events'],
		}),
	deleteFromMyInterestedEvents: oc
		.input(dto.deleteFromMyInterestedEventsInput)
		.output(dto.deleteFromMyInterestedEventsOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			method: 'DELETE',
			path: '/events/interested/:id',
			summary: 'Delete from My Interested Events',
			description: "Remove an event from the user's interested events list.",
			successStatus: 204,
			successDescription: 'No Content',
			tags: ['Events'],
		}),
	listByPlaceId: oc
		.input(dto.listByPlaceIdInput)
		.output(dto.listByPlaceIdOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			method: 'GET',
			path: '/events/place/:placeId',
			summary: 'List Events by Place ID',
			description: 'List events associated with a specific place ID.',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Events'],
		}),
	listByOrganizerId: oc
		.input(dto.listByOrganizerIdInput)
		.output(dto.listByOrganizerIdOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			method: 'GET',
			path: '/events/user/:userId',
			summary: 'List Events by Organizer ID',
			description: 'List events organized by a specific user ID.',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Events'],
		}),
	listInterestedFriends: oc
		.input(dto.listInterestedFriendsInput)
		.output(dto.listInterestedFriendsOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			method: 'GET',
			path: '/events/:id/interested',
			summary: 'List Interested Friends',
			description: 'List friends who are interested in a specific event.',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Events'],
		}),
};

export type Contract = typeof contract;
