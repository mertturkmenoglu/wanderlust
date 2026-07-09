import type { reviews as dto } from '@wanderlust/contract';

export type CreateReviewParams = dto.CreateInput & {
	detectedLanguage: string | null;
	urls: string[];
	facets: {
		type: string;
		value: string;
		start: number;
		end: number;
	}[];
};
