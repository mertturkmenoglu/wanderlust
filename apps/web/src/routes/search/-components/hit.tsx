import { Card } from '@/components/blocks/autocomplete/card';

export type Props = {
	hit: {
		id: string;
		location: [number, number];
		name: string;
		place: {
			id: string;
			address: {
				city: {
					id: number;
					name: string;
					countryName: string;
					stateName: string;
				};
			};
			amenities: string[];
			category: {
				id: number;
				image: string;
				name: string;
			};
			assets: {
				id: number;
				url: string;
			}[];
		};
	};
};

export function Hit({ hit }: Readonly<Props>) {
	return (
		<Card
			id={hit.place.id}
			name={hit.name}
			categoryName={hit.place.category.name}
			image={hit.place.assets[0]?.url ?? ''}
			city={hit.place.address.city.name}
			state={hit.place.address.city.stateName}
			isCardClickable={false}
		/>
	);
}
