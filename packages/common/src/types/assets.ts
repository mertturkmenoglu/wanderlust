import { schema } from '@wanderlust/db';
import { createInsertSchema, createSelectSchema } from 'drizzle-orm/zod';
import { z } from 'zod';
import { Attribution } from './attributions';
import { Resources } from './resources';
import { Timestamp } from './timestamp';
import { Url } from './url';

export const Asset = createSelectSchema(schema.assets, {
	url: Url,
	bucket: z.string().min(1).max(255),
	key: z.string().min(1).max(255),

	mimeType: z.string().min(1).max(63),
	size: z.number().int().nonnegative(),

	width: z.number().int().nonnegative().nullable(),
	height: z.number().int().nonnegative().nullable(),
	blurhash: z.string().min(1).max(255).nullable(),
	alt: z.string().min(1).max(255).nullable(),

	status: z.enum(['pending', 'ready', 'failed']),
	visibility: z.enum(['public', 'private']),

	uploadedBy: Resources.id.nullable(),
	metadata: z.record(z.string(), z.unknown()).nullable(),
	attributions: Attribution.array().max(4),

	createdAt: Timestamp,
	updatedAt: Timestamp,
	deletedAt: Timestamp.nullable(),
})
	.omit({
		id: true,
	})
	.meta({
		description: 'An asset entity',
	});

export type Asset = z.infer<typeof Asset>;

export namespace Assets {
	export namespace $Insert {
		export const Asset = createInsertSchema(schema.assets, {
			attributions: Attribution.array().max(4),
		})
			.pick({
				alt: true,
				attributions: true,
			})
			.extend({
				for: z.enum(['review', 'place']),
				file: z.file().max(1024 * 1024 * 16, {
					error: 'File size must not exceed 16MB',
				}),
			});

		export type Asset = z.infer<typeof Asset>;

		export const AssetDbInsert = createInsertSchema(schema.assets, {
			attributions: Attribution.array().max(4),
			metadata: z.record(z.string(), z.unknown()).nullable(),
		});

		export type AssetDbInsert = z.infer<typeof AssetDbInsert>;

		export const AssetToPlaceInsert = createInsertSchema(
			schema.assetsToPlaces,
			{
				assetId: Resources.id,
				placeId: Resources.id,
				order: z.number().int().nonnegative(),
			},
		);

		export type AssetToPlaceInsert = z.infer<typeof AssetToPlaceInsert>;
	}
}
