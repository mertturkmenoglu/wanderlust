import type { Props as THit } from '@/routes/search/-components/hit';

export type SearchResponse = {
	found: number;
	hits: {
		document: THit['hit'];
	}[];
	out_of: number;
	page: number;
};

export type Props = {
	className?: string;
};
