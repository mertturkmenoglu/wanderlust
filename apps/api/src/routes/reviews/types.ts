import type { Reviews } from '@wanderlust/contract';

export type CreateReviewParams = Reviews.dto.CreateInput & {
	detectedLanguage: string | null;
	facets: {
		type: string;
		value: string;
		start: number;
		end: number;
	}[];
};
