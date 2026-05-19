import { Link } from '@tanstack/react-router';
import { PlaceCard } from '@/components/place-card';

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
		<Link
			to="/p/$id"
			params={{
				id: hit.place.id,
			}}
		>
			<PlaceCard
				variant="item"
				place={{
					id: hit.place.id,
					name: hit.name,
					category: hit.place.category,
					assets: hit.place.assets.map((a) => ({
						...a,
						createdAt: new Date(a.createdAt),
						updatedAt: new Date(a.updatedAt),
					})),
					address: hit.place.address,
					totalPoints: 0,
					totalVotes: 0,
				}}
			/>
		</Link>
	);
}
