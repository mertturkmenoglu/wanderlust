import { Link } from '@tanstack/react-router';
import { PlaceCard } from '@/components/place-card';
import type { TSearchHit } from '@/lib/search';

export type Props = {
	hit: TSearchHit;
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
