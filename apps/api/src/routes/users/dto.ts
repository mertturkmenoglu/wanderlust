import { $dto } from '@wanderlust/common';
import z from 'zod';
import { Pagination } from '@/lib/pagination';

const profile = $dto.user.pick({
	id: true,
	username: true,
	name: true,
	image: true,
	banner: true,
	bio: true,
	website: true,
	followersCount: true,
	followingCount: true,
	createdAt: true,
});

const place = $dto.place.extend({
	assets: $dto.asset.array(),
	category: $dto.category,
	address: $dto.address.extend({
		city: $dto.city,
	}),
});

export const updateImageInput = z.object({
	file: z.file().max(1024 * 1024 * 5, 'File size must be less than 5MB'),
	type: z.enum(['profile', 'banner']),
});

export type UpdateImageInput = z.infer<typeof updateImageInput>;

export const updateImageOutput = z.object({
	profile: profile,
});

export type UpdateImageOutput = z.infer<typeof updateImageOutput>;

export const getInput = profile.pick({
	username: true,
});

export type GetInput = z.infer<typeof getInput>;

export const getOutput = z.object({
	profile: profile,
	meta: z.object({
		isFollowing: z.boolean(),
		isSelf: z.boolean(),
	}),
});

export type GetOutput = z.infer<typeof getOutput>;

export const getMeInput = z.object({});

export type GetMeInput = z.infer<typeof getMeInput>;

export const getMeOutput = z.object({
	profile: profile,
});

export type GetMeOutput = z.infer<typeof getMeOutput>;

export const getRoleInput = z.object({});

export type GetRoleInput = z.infer<typeof getRoleInput>;

export const getRoleOutput = z.object({
	role: z.enum(['user', 'admin']),
});

export type GetRoleOutput = z.infer<typeof getRoleOutput>;

export const listFollowersInput = profile
	.pick({
		username: true,
	})
	.extend(Pagination.queryParamsSchema.shape);

export type ListFollowersInput = z.infer<typeof listFollowersInput>;

export const listFollowersOutput = z.object({
	followers: z.array(profile),
	pagination: Pagination.schema,
});

export type ListFollowersOutput = z.infer<typeof listFollowersOutput>;

export const listFollowingInput = profile
	.pick({
		username: true,
	})
	.extend(Pagination.queryParamsSchema.shape);

export type ListFollowingInput = z.infer<typeof listFollowingInput>;

export const listFollowingOutput = z.object({
	following: z.array(profile),
	pagination: Pagination.schema,
});

export type ListFollowingOutput = z.infer<typeof listFollowingOutput>;

export const listTopPlacesInput = profile.pick({
	username: true,
});

export type ListTopPlacesInput = z.infer<typeof listTopPlacesInput>;

export const listTopPlacesOutput = z.object({
	places: place.array(),
});

export type ListTopPlacesOutput = z.infer<typeof listTopPlacesOutput>;

export const updateTopPlacesInput = z.object({
	placesIds: z.array(z.string().min(1)).min(0).max(4),
});

export type UpdateTopPlacesInput = z.infer<typeof updateTopPlacesInput>;

export const updateTopPlacesOutput = z.object({
	places: place.array(),
});

export type UpdateTopPlacesOutput = z.infer<typeof updateTopPlacesOutput>;

export const searchFollowingInput = profile.pick({
	username: true,
});

export type SearchFollowingInput = z.infer<typeof searchFollowingInput>;

export const searchFollowingOutput = z.object({
	friends: z.array(profile),
});

export type SearchFollowingOutput = z.infer<typeof searchFollowingOutput>;

export const listUserActivitiesInput = profile.pick({
	username: true,
});

export type ListUserActivitiesInput = z.infer<typeof listUserActivitiesInput>;

export const listUserActivitiesOutput = z.object({
	activities: z.array(z.record(z.string(), z.unknown())),
});

export type ListUserActivitiesOutput = z.infer<typeof listUserActivitiesOutput>;

export const followInput = profile.pick({
	username: true,
});

export type FollowInput = z.infer<typeof followInput>;

export const followOutput = z.object({
	isFollowing: z.boolean(),
});

export type FollowOutput = z.infer<typeof followOutput>;

export const updateInput = z.object({
	name: profile.pick({ name: true }).shape.name,
	bio: profile.pick({ bio: true }).shape.bio,
	website: profile.pick({ website: true }).shape.website,
});

export type UpdateInput = z.infer<typeof updateInput>;

export const updateOutput = z.object({
	profile: profile,
});

export type UpdateOutput = z.infer<typeof updateOutput>;
