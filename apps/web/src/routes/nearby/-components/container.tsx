// oxlint-disable avoid-new

import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { LoaderCircleIcon } from 'lucide-react';
import { useGeoSearch } from 'react-instantsearch';
import MapContainer from 'react-map-gl/maplibre';
import { AppMessage } from '@/components/blocks/app-message';
import { PlaceCard } from '@/components/blocks/place-card';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { createStyle } from '@/lib/map';
import { GeoSearch } from './geo-search';

export function Container() {
	const { items } = useGeoSearch();

	const query = useQuery({
		queryKey: ['geolocation-permission'],
		queryFn: () => {
			return new Promise<[number, number]>((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(
					(pos) => {
						return resolve([pos.coords.latitude, pos.coords.longitude]);
					},
					(err) => {
						return reject(err.message);
					},
					{
						timeout: 100_000,
					},
				);
			});
		},
		refetchOnWindowFocus: false,
		staleTime: Number.POSITIVE_INFINITY,
	});

	if (query.isLoading) {
		return (
			<div className="flex flex-col items-center justify-center">
				<LoaderCircleIcon className="mx-auto mt-32 size-12 animate-spin text-primary" />
				<div className="mt-8 mb-32 text-sm">Allow access to your location</div>
			</div>
		);
	}

	if (query.error) {
		return (
			<div className="flex flex-col items-center justify-center">
				<AppMessage
					emptyMessage={
						query.error.message ?? 'Give permission to access your location'
					}
					showBackButton={false}
					className="mt-32"
				/>
				<Button
					variant="link"
					className="mb-32"
					onClick={() => query.refetch()}
				>
					Retry
				</Button>
			</div>
		);
	}

	return (
		<div>
			<MapContainer
				initialViewState={{
					longitude: query.data?.[1],
					latitude: query.data?.[0],
					zoom: 14,
					pitch: 0,
					bearing: 0,
				}}
				mapStyle={createStyle('streets-v2-light')}
				minZoom={4}
				style={{
					height: '600px',
					marginTop: '16px',
					zIndex: 0,
				}}
			>
				<GeoSearch />
			</MapContainer>

			<div className="mx-auto mt-8 max-w-4xl">
				{items.length === 0 && (
					<AppMessage
						emptyMessage="No nearby locations found"
						showBackButton={false}
						className="mt-4"
					/>
				)}
				{items.length > 0 && (
					<ScrollArea className="mt-4 h-[600px]">
						<div className="grid gap-8 pr-4 md:grid-cols-2">
							{items.map((item) => (
								<Link
									to="/p/$id"
									key={item.place.id}
									params={{
										id: item.place.id,
									}}
								>
									<PlaceCard place={item.place} />
								</Link>
							))}
						</div>
						<ScrollBar />
					</ScrollArea>
				)}
			</div>
		</div>
	);
}
