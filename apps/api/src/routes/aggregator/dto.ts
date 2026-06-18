import { $dto } from '@wanderlust/common';
import z from 'zod';

const place = $dto.place.extend({
	assets: $dto.asset.array(),
	category: $dto.category,
	address: $dto.address.extend({
		city: $dto.city,
	}),
});

export const homeInput = z.object({});

export type HomeInput = z.infer<typeof homeInput>;

const placeWithMeta = z.object({
	place: place,
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
