import { Types } from '@wanderlust/common';
import z from 'zod';

export namespace dto {
	export const updateImageInput = z.object({
		file: z.file().max(1024 * 1024 * 5, 'File size must be less than 5MB'),
		type: z.enum(['profile', 'banner']),
	});

	export type UpdateImageInput = z.infer<typeof updateImageInput>;

	export const updateImageOutput = z.object({
		profile: Types.Users.View.Profile,
	});

	export type UpdateImageOutput = z.infer<typeof updateImageOutput>;

	export const getInput = Types.User.pick({
		username: true,
	});

	export type GetInput = z.infer<typeof getInput>;

	export const getOutput = z.object({
		profile: Types.Users.View.Profile,
		meta: Types.Users.Meta,
	});

	export type GetOutput = z.infer<typeof getOutput>;

	export const getByIdInput = z.object({
		id: Types.Resources.id,
	});

	export type GetByIdInput = z.infer<typeof getByIdInput>;

	export const getByIdOutput = getOutput.extend({});

	export type GetByIdOutput = z.infer<typeof getByIdOutput>;

	export const getMeInput = z.object({});

	export type GetMeInput = z.infer<typeof getMeInput>;

	export const getMeOutput = z.object({
		profile: Types.Users.View.Profile,
	});

	export type GetMeOutput = z.infer<typeof getMeOutput>;

	export const listFollowersInput = Types.User.pick({
		username: true,
	}).extend(Types.Pagination.queryParamsSchema.shape);

	export type ListFollowersInput = z.infer<typeof listFollowersInput>;

	export const listFollowersOutput = z.object({
		followers: z.array(Types.Users.View.Profile),
		pagination: Types.Pagination.schema,
	});

	export type ListFollowersOutput = z.infer<typeof listFollowersOutput>;

	export const listFollowingInput = Types.User.pick({
		username: true,
	}).extend(Types.Pagination.queryParamsSchema.shape);

	export type ListFollowingInput = z.infer<typeof listFollowingInput>;

	export const listFollowingOutput = z.object({
		following: z.array(Types.Users.View.Profile),
		pagination: Types.Pagination.schema,
	});

	export type ListFollowingOutput = z.infer<typeof listFollowingOutput>;

	export const listTopPlacesInput = Types.User.pick({
		username: true,
	});

	export type ListTopPlacesInput = z.infer<typeof listTopPlacesInput>;

	export const listTopPlacesOutput = z.object({
		places: z
			.object({
				place: Types.Places.Extended,
				meta: Types.Places.Meta,
			})
			.array(),
	});

	export type ListTopPlacesOutput = z.infer<typeof listTopPlacesOutput>;

	export const updateTopPlacesInput = z.object({
		placeIds: z.array(Types.Resources.id).min(0).max(4),
	});

	export type UpdateTopPlacesInput = z.infer<typeof updateTopPlacesInput>;

	export const updateTopPlacesOutput = z.object({
		places: z
			.object({
				place: Types.Places.Extended,
				meta: Types.Places.Meta,
			})
			.array(),
	});

	export type UpdateTopPlacesOutput = z.infer<typeof updateTopPlacesOutput>;

	export const searchFollowingInput = z.object({
		username: z
			.string()
			.min(1)
			.max(20)
			.meta({
				description: 'Unique username of the user',
				examples: ['johndoe'],
			}),
	});

	export type SearchFollowingInput = z.infer<typeof searchFollowingInput>;

	export const searchFollowingOutput = z.object({
		friends: z.array(Types.Users.View.Profile),
	});

	export type SearchFollowingOutput = z.infer<typeof searchFollowingOutput>;

	export const listUserActivitiesInput = Types.User.pick({
		username: true,
	});

	export type ListUserActivitiesInput = z.infer<typeof listUserActivitiesInput>;

	export const listUserActivitiesOutput = z.object({
		activities: z.array(
			z.object({
				type: z.enum([
					'create_favorite',
					'create_list',
					'create_review',
					'create_trip',
					'follow',
					'like_review',
				]),
				createdAt: z.date(),
				data: z.record(z.string(), z.unknown()),
			}),
		),
	});

	export type ListUserActivitiesOutput = z.infer<
		typeof listUserActivitiesOutput
	>;

	export const followInput = Types.User.pick({
		username: true,
	});

	export type FollowInput = z.infer<typeof followInput>;

	export const followOutput = z.object({
		isFollowing: z.boolean(),
	});

	export type FollowOutput = z.infer<typeof followOutput>;

	export const updateInput = Types.User.pick({
		name: true,
		bio: true,
		website: true,
		location: true,
	});

	export type UpdateInput = z.infer<typeof updateInput>;

	export const updateOutput = z.object({
		profile: Types.Users.View.Profile,
	});

	export type UpdateOutput = z.infer<typeof updateOutput>;

	export const checkUsernameAvailabilityInput = z.object({
		username: z
			.string()
			.min(1)
			.max(20)
			.meta({
				description: 'Unique username of the user',
				examples: ['johndoe'],
			}),
	});

	export type CheckUsernameAvailabilityInput = z.infer<
		typeof checkUsernameAvailabilityInput
	>;

	export const checkUsernameAvailabilityOutput = z.object({
		available: z.boolean(),
	});

	export type CheckUsernameAvailabilityOutput = z.infer<
		typeof checkUsernameAvailabilityOutput
	>;
}
