import { oc } from '@orpc/contract';
import { dto } from './dto';

export const contract = {
	unfurlLink: oc
		.input(dto.unfurlLinkInput)
		.output(dto.unfurlLinkOutput)
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
			path: '/chats/compose/unfurl-link',
			summary: 'Unfurl a link',
			description:
				'Unfurls a link and retrieves metadata such as title, description, and images.',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Compose'],
		}),
	gifSearch: oc
		.input(dto.gifSearchInput)
		.output(dto.gifSearchOutput)
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
			path: '/chats/compose/gif-search',
			summary: 'Search for GIFs',
			description:
				'Searches for GIFs based on the provided query and returns a list of matching GIFs.',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Compose'],
		}),
	stickerList: oc
		.input(dto.stickerListInput)
		.output(dto.stickerListOutput)
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
			path: '/chats/compose/sticker-list',
			summary: 'Get sticker list',
			description: 'Retrieves a list of available stickers.',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Compose'],
		}),
};

export type Contract = typeof contract;
