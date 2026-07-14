import { $dto } from '@wanderlust/common';
import z from 'zod';

export const homeInput = z.object({});

export type HomeInput = z.infer<typeof homeInput>;

const placeWithMeta = z.object({
	place: $dto.place
		.pick({
			id: true,
			name: true,
			rating: true,
			locality: true,
			adminAreaName: true,
			countryName: true,
		})
		.extend({
			accolades: z
				.object({
					id: z.string(),
					accolade: z.object({
						id: z.string(),
						title: z.string(),
					}),
				})
				.array(),
			assets: z
				.object({
					url: z.string(),
				})
				.array(),
			primaryCategory: z.object({
				displayName: z.string(),
			}),
		}),
	meta: z.object({
		isFavorite: z.boolean(),
	}),
});

export const homeOutput = z.object({
	new: placeWithMeta.array(),
	popular: placeWithMeta.array(),
	featured: placeWithMeta.array(),
	favorites: placeWithMeta.array(),
});

export type HomeOutput = z.infer<typeof homeOutput>;
