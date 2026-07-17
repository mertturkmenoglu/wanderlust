import { Types } from '@wanderlust/common';
import z from 'zod';

export namespace dto {
	export const getInput = Types.Place.pick({
		id: true,
	});

	export type GetInput = z.infer<typeof getInput>;

	export const getOutput = z.object({
		place: Types.Places.Extended,
		meta: Types.Places.Meta.extend({
			isBookmarked: z.boolean().meta({
				description:
					"Whether the place is bookmarked in any of the user's lists",
				examples: [false],
			}),
		}),
	});

	export type GetOutput = z.infer<typeof getOutput>;

	export const listInput = z.object({});

	export const listOutput = z.object({
		places: Types.Places.Extended.array(),
	});

	export type ListOutput = z.infer<typeof listOutput>;

	export const updateInput = Types.Place.omit({
		createdAt: true,
		updatedAt: true,
		rating: true,
	});

	export type UpdateInput = z.infer<typeof updateInput>;

	export const updateOutput = z.object({
		place: Types.Places.Extended,
	});

	export type UpdateOutput = z.infer<typeof updateOutput>;

	export const deleteInput = Types.Place.pick({
		id: true,
	});

	export type DeleteInput = z.infer<typeof deleteInput>;

	export const deleteOutput = z.object({});
}
