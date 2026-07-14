import type { Outputs } from '@/lib/orpc';

type Asset = Pick<
	Outputs['places']['get']['place']['assets'][number],
	'url' | 'description'
>;

type Accolade = {
	id: string;
	accolade: Pick<
		Outputs['places']['get']['place']['accolades'][number]['accolade'],
		'id' | 'title'
	>;
};

type PrimaryCategory = Pick<
	Outputs['places']['get']['place']['primaryCategory'],
	'displayName'
>;

export type Place = Pick<
	Outputs['places']['get']['place'],
	'id' | 'name' | 'locality' | 'adminAreaName' | 'countryName' | 'rating'
> & {
	assets: Asset[];
	accolades: Accolade[];
	primaryCategory: PrimaryCategory;
};

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
