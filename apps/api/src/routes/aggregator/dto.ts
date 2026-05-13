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

export const homeOutput = z.object({
	new: place.array(),
	popular: place.array(),
	featured: place.array(),
	favorites: place.array(),
});

export type HomeOutput = z.infer<typeof homeOutput>;
