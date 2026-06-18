import { $extended } from '@wanderlust/common';
import z from 'zod';

export const homeInput = z.object({});

export type HomeInput = z.infer<typeof homeInput>;

const placeWithMeta = z.object({
	place: $extended.place,
	meta: z.object({
		isFavorite: z.boolean(),
	}),
})

export const homeOutput = z.object({
	new: placeWithMeta.array(),
	popular: placeWithMeta.array(),
	featured: placeWithMeta.array(),
	favorites: placeWithMeta.array(),
});

export type HomeOutput = z.infer<typeof homeOutput>;
