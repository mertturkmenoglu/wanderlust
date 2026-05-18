import type { Outputs } from '@/lib/orpc';

export type Place = Pick<
	Outputs['places']['get']['place'],
	| 'id'
	| 'name'
	| 'category'
	| 'address'
	| 'totalVotes'
	| 'totalPoints'
	| 'assets'
>;

export type Props = {
	place: Place;
	variant?: 'default' | 'item';
} & React.HTMLAttributes<HTMLDivElement>;
