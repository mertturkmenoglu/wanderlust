import { Types } from '@wanderlust/common';
import z from 'zod';

export namespace dto {
	export const createInput = z.object({
		asset: Types.Assets.$Insert.Asset,
	});

	export type CreateInput = z.infer<typeof createInput>;

	export const createOutput = z.object({
		asset: Types.Asset.extend({
			id: Types.Resources.id,
		}),
	});

	export type CreateOutput = z.infer<typeof createOutput>;
}
