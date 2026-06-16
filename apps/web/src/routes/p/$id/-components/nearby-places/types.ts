import type { TSearchHit } from '@/lib/search';

export type SearchResponse = {
	found: number;
	hits: {
		document: TSearchHit;
	}[];
	out_of: number;
	page: number;
};

export type Props = {
	className?: string;
};
