import { Types } from '@wanderlust/common';
import z from 'zod';

export namespace dto {
	export const homeInput = z.object({});

	export type HomeInput = z.infer<typeof homeInput>;

	const placeWithMeta = z.object({
		place: Types.Place.pick({
			id: true,
			name: true,
			rating: true,
			locality: true,
			adminAreaName: true,
			countryName: true,
		}).extend({
			accolades: z.array(Types.Accolade.pick({ id: true, title: true })),
			assets: z.array(Types.Asset.pick({ url: true })),
			primaryCategory: Types.Category.pick({ displayName: true }),
		}),
		meta: Types.Places.Meta,
	});

	export const homeOutput = z.object({
		new: placeWithMeta.array(),
		popular: placeWithMeta.array(),
		featured: placeWithMeta.array(),
		favorites: placeWithMeta.array(),
	});

	export type HomeOutput = z.infer<typeof homeOutput>;
}
