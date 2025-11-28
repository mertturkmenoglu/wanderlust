import { useQuery } from '@tanstack/react-query';
import { getRouteApi, Link } from '@tanstack/react-router';
import { LoaderCircleIcon } from 'lucide-react';
import { AppMessage } from '@/components/blocks/app-message';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { env } from '@/lib/env';
import { ipx } from '@/lib/ipx';
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
				<ScrollArea>
					<div className="my-4 flex gap-8">
						{(query.data.hits ?? []).slice(0, 6).map(({ document: p }) => (
							<Link
								to="/p/$id"
								params={{
									id: p.place.id,
								}}
								key={p.place.id}
							>
								<div className="group w-[256px]">
									<img
										src={ipx(p.place.assets[0]?.url ?? '', 'w_512')}
										alt=""
										className="aspect-video w-full rounded-md object-cover"
									/>

									<div className="my-2">
										<div className="mt-2 line-clamp-1 font-semibold text-lg capitalize">
											{p.name}
										</div>
										<div className="line-clamp-1 text-muted-foreground text-sm">
											{p.place.address.city.name} /{' '}
											{p.place.address.city.country.name}
										</div>
									</div>

									<div>
										<div className="flex-1 space-y-2">
											<div className="text-primary text-sm">
												{p.place.category.name}
											</div>
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>
					<ScrollBar orientation="horizontal" className="mt-8" />
				</ScrollArea>
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
