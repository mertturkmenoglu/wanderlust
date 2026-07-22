import { Types } from '@wanderlust/common';
import z from 'zod';

export namespace dto {
	export const getInput = Types.Review.pick({
		id: true,
	});

	export type GetInput = z.infer<typeof getInput>;

	export const getOutput = z.object({
		review: Types.Reviews.ExtendedWithPlace,
		meta: Types.Reviews.Meta,
	});

	export type GetOutput = z.infer<typeof getOutput>;

	export const createInput = Types.Review.pick({
		placeId: true,
		content: true,
		rating: true,
		visitedAt: true,
	}).extend({
		files: z
			.array(z.string())
			.max(4, { error: 'You can upload up to 4 files' })
			.optional()
			.meta({
				description:
					'An array of file IDs that has been uploaded to the system previously. The files should be uploaded using the assets upload endpoint before creating a review.',
				examples: [['file-id-1', 'file-id-2']],
			}),
	});

	export type CreateInput = z.infer<typeof createInput>;

	export const createOutput = z.object({
		review: Types.Reviews.Extended,
	});

	export type CreateOutput = z.infer<typeof createOutput>;

	export const deleteInput = Types.Review.pick({
		id: true,
	});

	export type DeleteInput = z.infer<typeof deleteInput>;

	export const deleteOutput = z.object({});

	export type DeleteOutput = z.infer<typeof deleteOutput>;

	export const listByUsernameInput = Types.Pagination.queryParamsSchema.extend(
		Types.User.pick({ username: true }).shape,
	);

	export type ListByUsernameInput = z.infer<typeof listByUsernameInput>;

	export const listByUsernameOutput = z.object({
		reviews: z
			.object({
				review: Types.Reviews.ExtendedWithPlace,
				meta: Types.Reviews.Meta,
			})
			.array(),
		pagination: Types.Pagination.schema,
	});

	export type ListByUsernameOutput = z.infer<typeof listByUsernameOutput>;

	export const listByPlaceIdInput = Types.Pagination.queryParamsSchema
		.extend(Types.Place.pick({ id: true }).shape)
		.extend(
			z.object({
				sortBy: z
					.enum(['created_at', 'rating', 'likes'])
					.optional()
					.meta({
						description: 'Field to sort by',
						examples: ['created_at', 'rating', 'likes'],
					}),
				sortOrd: z
					.enum(['asc', 'desc'])
					.optional()
					.meta({
						description: 'Sort order',
						examples: ['asc', 'desc'],
					}),
				minRating: z
					.number()
					.int()
					.min(0)
					.max(4)
					.optional()
					.meta({
						description: 'Minimum rating filter',
						examples: [3, 4],
					}),
				maxRating: z
					.number()
					.int()
					.min(1)
					.max(5)
					.optional()
					.meta({
						description: 'Maximum rating filter',
						examples: [4, 5],
					}),
			}).shape,
		);

	export type ListByPlaceIdInput = z.infer<typeof listByPlaceIdInput>;

	export const listByPlaceIdOutput = z.object({
		reviews: z
			.object({
				review: Types.Reviews.Extended,
				meta: Types.Reviews.Meta,
			})
			.array(),
		pagination: Types.Pagination.schema,
	});

	export type ListByPlaceIdOutput = z.infer<typeof listByPlaceIdOutput>;

	export const getRatingsInput = Types.Place.pick({
		id: true,
	});

	export type GetRatingsInput = z.infer<typeof getRatingsInput>;

	export const getRatingsOutput = z.object({
		ratings: z.record(z.string(), z.number().int()).meta({
			description: 'A mapping of rating values to their respective counts',
			examples: [
				{
					5: 10,
					4: 5,
					3: 2,
					2: 1,
					1: 0,
				},
			],
		}),
		totalVotes: z
			.number()
			.int()
			.meta({
				description: 'Total number of votes',
				examples: [18],
			}),
	});

	export type GetRatingsOutput = z.infer<typeof getRatingsOutput>;

	export const listAssetsByPlaceIdInput = Types.Place.pick({
		id: true,
	});

	export type ListAssetsByPlaceIdInput = z.infer<
		typeof listAssetsByPlaceIdInput
	>;

	export const listAssetsByPlaceIdOutput = z.object({
		assets: Types.Asset.array(),
	});

	export type ListAssetsByPlaceIdOutput = z.infer<
		typeof listAssetsByPlaceIdOutput
	>;

	export const likeInput = Types.Review.pick({
		id: true,
	});

	export type LikeInput = z.infer<typeof likeInput>;

	export const likeOutput = z.object({
		liked: z.boolean().meta({
			description: 'Indicates whether the review was liked or unliked',
			examples: [true, false],
		}),
	});

	export type LikeOutput = z.infer<typeof likeOutput>;

	export const listLikesInput = Types.Pagination.queryParamsSchema.extend(
		Types.Review.pick({ id: true }).shape,
	);

	export type ListLikesInput = z.infer<typeof listLikesInput>;

	export const listLikesOutput = z.object({
		users: Types.Users.View.Basic.array(),
		pagination: Types.Pagination.schema,
	});

	export type ListLikesOutput = z.infer<typeof listLikesOutput>;
}
