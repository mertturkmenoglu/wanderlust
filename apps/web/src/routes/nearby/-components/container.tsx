import { ScrollArea, ScrollBar } from '@wanderlust/ui/components/scroll-area';
import { useGeoSearch } from 'react-instantsearch';
import MapContainer from 'react-map-gl/maplibre';
import { AppMessage } from '@/components/app-message';
import { useIsMobile } from '@/hooks/use-mobile';
import { createStyle } from '@/lib/map';
import { ErrorComponent } from './error';
import { GeoSearch } from './geo-search';
import { ItemComponent } from './item';
import { Loading } from './loading';
import { useGeolocationPermission } from './use-geolocation-permission';

export function Container() {
	const { items } = useGeoSearch();
	const query = useGeolocationPermission();
	const isMobile = useIsMobile();

	if (query.isLoading) {
		return <Loading />;
	}

	if (query.error) {
		return (
			<ErrorComponent
				message={query.error.message}
				refetch={() => query.refetch()}
			/>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
			<div className="order-last md:order-first">
				{items.length === 0 && (
					<AppMessage
						empty="No nearby locations found"
						classNames={{ root: 'mt-4' }}
					/>
				)}
				{items.length > 0 && (
					<ScrollArea className="mt-4 h-150">
						<div className="flex flex-col gap-2 pr-4">
							{items.map((item) => (
								<ItemComponent key={`item-${item.place.id}`} item={item} />
							))}
						</div>
						<ScrollBar />
					</ScrollArea>
				)}
			</div>
			<MapContainer
				initialViewState={{
					longitude: query.data?.[1],
					latitude: query.data?.[0],
					zoom: isMobile ? 12 : 14,
					pitch: 0,
					bearing: 0,
				}}
				mapStyle={createStyle('streets-v2-light')}
				minZoom={10}
				style={{
					height: isMobile ? '200px' : '600px',
					marginTop: '16px',
					zIndex: 0,
				}}
			>
				<GeoSearch />
			</MapContainer>
		</div>
	);
}
