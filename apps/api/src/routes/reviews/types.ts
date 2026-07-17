import type { Reviews } from '@wanderlust/contract';

export type CreateReviewParams = Reviews.dto.CreateInput & {
	detectedLanguage: string | null;
	urls: string[];
	facets: {
		type: string;
		value: string;
		start: number;
		end: number;
	}[];
};
