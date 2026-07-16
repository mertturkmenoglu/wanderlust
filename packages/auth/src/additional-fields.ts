import { z } from 'zod';
import { isValidUsername } from './username';

export const additionalFields = {
	username: {
		type: 'string',
		input: true,
		validator: {
			input: z.string().refine(isValidUsername, {
				error: 'Username is invalid',
			}),
		},
	},
	banner: {
		type: 'string',
		input: false,
		required: false,
	},
	bio: {
		type: 'string',
		input: true,
		required: false,
	},
	website: {
		type: 'string',
		input: true,
		required: false,
	},
	location: {
		type: 'string',
		input: true,
		required: false,
	},
	followersCount: {
		type: 'number',
		input: false,
		required: false,
	},
	followingCount: {
		type: 'number',
		input: false,
		required: false,
	},
} as const;
