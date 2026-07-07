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
	| 'accolades'
>;

export type Props = {
	place: Place;
	meta?: {
		isFavorite: boolean;
	};
	variant?: 'default' | 'item';
	as?: 'div' | 'link';
} & React.HTMLAttributes<HTMLDivElement>;

export type MinimalPlace = Pick<Place, 'id' | 'name'> & {
	image: string;
};

export type MinimalPlaceProps = {
	place: MinimalPlace;
	variant?: 'default' | 'item';
	as?: 'div' | 'link';
} & React.HTMLAttributes<HTMLDivElement>;
