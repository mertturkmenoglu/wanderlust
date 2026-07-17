import { schema } from '@wanderlust/db';
import { createInsertSchema, createSelectSchema } from 'drizzle-orm/zod';
import { z } from 'zod';
import { Resources } from './resources';
import { Timestamp } from './timestamp';
import { Url } from './url';

export const User = createSelectSchema(schema.users, {
	id: Resources.id,
	name: z
		.string()
		.min(1)
		.max(256)
		.meta({
			description: 'Full name of the user',
			examples: ['John Doe'],
		}),
	username: z
		.string()
		.min(4)
		.max(32)
		.meta({
			description: 'Unique username of the user',
			examples: ['johndoe'],
		}),
	email: z.email().meta({
		description: 'Email address of the user',
		examples: ['johndoe@example.com'],
	}),
	emailVerified: z.boolean().meta({
		description: "Whether the user's email is verified",
		examples: [true],
	}),
	image: Url.nullable(),
	banner: Url.nullable(),
	bio: z
		.string()
		.max(512)
		.nullable()
		.meta({
			description: 'Short biography of the user',
			examples: [
				'Travel enthusiast and photographer. Love exploring new places!',
			],
		}),
	website: Url.nullable(),
	followersCount: z
		.number()
		.int()
		.min(0)
		.meta({
			description: 'Number of followers the user has',
			examples: [150],
		}),
	followingCount: z
		.number()
		.int()
		.min(0)
		.meta({
			description: 'Number of users the user is following',
			examples: [75],
		}),
	location: z
		.string()
		.max(32)
		.nullable()
		.meta({
			description: 'Location of the user',
			examples: ['New York, USA'],
		}),
	createdAt: Timestamp,
	updatedAt: Timestamp,
}).meta({
	description: 'A user entity',
});

export namespace Users {
	export const Meta = z.object({
		isFollowing: z.boolean(),
		isSelf: z.boolean(),
	});

	export const Follow = createSelectSchema(schema.follows, {
		followerId: Resources.id,
		followingId: Resources.id,
		createdAt: Timestamp,
	});

	export const TopPlace = createSelectSchema(schema.userTopPlaces, {
		userId: Resources.id,
		placeId: Resources.id,
		index: z
			.number()
			.min(0)
			.meta({
				description: "Index of the place in the user's top places",
				examples: [0],
			}),
	}).meta({
		description: 'A user top places entity',
	});

	export namespace $Insert {
		export const User = createInsertSchema(schema.users);

		export const Follow = createInsertSchema(schema.follows);

		export const TopPlace = createInsertSchema(schema.userTopPlaces);
	}

	export namespace View {
		export const Basic = User.pick({
			id: true,
			name: true,
			username: true,
			image: true,
		});

		export const Profile = User.pick({
			id: true,
			username: true,
			name: true,
			image: true,
			banner: true,
			bio: true,
			website: true,
			location: true,
			followersCount: true,
			followingCount: true,
			createdAt: true,
		});
	}
}
