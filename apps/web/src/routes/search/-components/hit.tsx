import { Card } from '@/components/autocomplete/card';

export type Props = {
	hit: {
		id: string;
		location: [number, number];
		name: string;
		place: {
			id: string;
			address: {
				id: number;
				cityId: number;
				line1: string;
				line2: string | null;
				postalCode: string | null;
				lat: number;
				lng: number;
				city: {
					id: number;
					name: string;
					countryName: string;
					countryCode: string;
					stateName: string;
					stateCode: string;
					image: string;
					lat: number;
					lng: number;
					description: string;
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
				entityType: 'place' | 'review';
				entityId: string;
				description: string | null;
				order: number;
				createdAt: string;
				updatedAt: string;
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
