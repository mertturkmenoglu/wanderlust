import { useQuery } from '@tanstack/react-query';
import { getRouteApi, Link } from '@tanstack/react-router';
import { LoaderCircleIcon } from 'lucide-react';
import { AppMessage } from '@/components/blocks/app-message';
import { PlaceCard } from '@/components/blocks/place-card';
import { env } from '@/lib/env';
import { cn } from '@/lib/utils';
import type { Props as THit } from '@/routes/search/-components/hit';

type SearchResponse = {
	found: number;
	hits: {
		document: THit['hit'];
	}[];
	out_of: number;
	page: number;
};

type Props = {
	className?: string;
};

const searchApiKey = env.VITE_SEARCH_CLIENT_API_KEY;
const searchApiUrl = env.VITE_SEARCH_CLIENT_URL;
const headers = {
	'X-TYPESENSE-API-KEY': searchApiKey,
};

function useNearbyPlaces() {
	const route = getRouteApi('/p/$id/');
	const { place } = route.useLoaderData();

	return useQuery({
		queryKey: ['place-nearby', place.id],
		queryFn: async () => {
			const sp = new URLSearchParams();
			sp.append('q', '*');
			sp.append('query_by', 'name');
			sp.append(
				'filter_by',
				`location:(${place.address.lat},${place.address.lng},50 km)`,
			);
			const url = `${searchApiUrl}/collections/places/documents/search?${sp.toString()}`;
			const res = await fetch(url, {
				headers,
			});
			const data = (await res.json()) as SearchResponse;
			return data;
		},
	});
}

export function NearbyPlaces({ className }: Props) {
	const query = useNearbyPlaces();

	if (query.data) {
		return (
			<div className={cn(className)}>
				<h3 className="font-semibold text-xl tracking-tight">
					Nearby Locations
				</h3>
				<div className="">
					<div className="my-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
						{(query.data.hits ?? []).slice(0, 5).map(({ document: p }) => (
							<Link
								to="/p/$id"
								params={{
									id: p.place.id,
								}}
								key={p.place.id}
							>
								<PlaceCard
									place={{
										...p.place,
										name: p.name,
										totalVotes: 0,
										totalPoints: 0,
										assets: p.place.assets.map((a) => ({
											...a,
											createdAt: new Date(a.createdAt),
											updatedAt: new Date(a.updatedAt),
										})),
									}}
								/>
							</Link>
						))}
					</div>
					{/* <ScrollBar orientation="horizontal" className="mt-8" /> */}
				</div>
			</div>
		);
	}

	if (query.error) {
		return (
			<AppMessage errorMessage="Something went wrong" showBackButton={false} />
		);
	}

	return (
		<div>
			<LoaderCircleIcon className="mx-auto size-12 animate-spin text-primary" />
		</div>
	);
}
