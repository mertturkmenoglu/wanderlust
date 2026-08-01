import { Badge } from '@wanderlust/ui/components/badge';
import { Separator } from '@wanderlust/ui/components/separator';
import { cn } from '@wanderlust/ui/lib/utils';
import { useMemo, useState } from 'react';
import MapContainer, {
	FullscreenControl,
	GeolocateControl,
	Marker,
	NavigationControl,
	Popup,
} from 'react-map-gl/maplibre';
import { AppMessage } from '@/components/app-message';
import { Pin } from '@/components/pin';
import { PlaceCard } from '@/components/place-card';
import { useMapStyle } from '@/hooks/use-map-style';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTripPlaces } from './hooks';

type Props = {
	className?: string;
};

export function MapSection({ className }: Props) {
	return (
		<div className={cn('flex flex-col gap-2', className)}>
			<h3 className="font-semibold text-xl tracking-tight">Map</h3>

			<Separator />

			<Inner />
		</div>
	);
}

function Inner() {
	const places = useTripPlaces();
	const isMobile = useIsMobile();
	const style = useMapStyle();
	const first = places[0];
	const [itemIndex, setItemIndex] = useState(-1);
	const markers = useMemo(() => {
		return places.map((p, i) => {
			return (
				<Marker
					key={`marker-${p.id}`}
					latitude={p.lat}
					longitude={p.lng}
					onClick={(e) => {
						e.originalEvent.stopPropagation();
						setItemIndex(i);
					}}
					anchor="bottom"
				>
					<Badge className="ml-1.5">{i + 1}</Badge>
					<Pin />
				</Marker>
			);
		});
	}, [places]);

	if (!first) {
		return (
			<AppMessage empty="No places found. Add new items to your itinerary." />
		);
	}

	return (
		<MapContainer
			reuseMaps
			initialViewState={{
				longitude: first.lng,
				latitude: first.lat,
				zoom: isMobile ? 12 : 14,
				pitch: 0,
				bearing: 0,
			}}
			mapStyle={style}
			minZoom={6}
			style={{
				height: '600px',
				marginTop: '8px',
				zIndex: 0,
			}}
		>
			<GeolocateControl position="top-right" />
			<FullscreenControl position="top-right" />
			<NavigationControl position="top-right" />

			{markers}
			{itemIndex !== -1 && places[itemIndex] && (
				<Popup
					onClose={() => setItemIndex(-1)}
					latitude={places[itemIndex].lat}
					longitude={places[itemIndex].lng}
					closeButton={false}
					anchor="top"
					closeOnMove={false}
					className="flex min-w-md p-0! [&>div:nth-child(2)]:rounded-md! [&>div:nth-child(2)]:bg-none! [&>div:nth-child(2)]:p-0! [&>div:nth-child(2)]:shadow-none!"
				>
					<PlaceCard as="link" place={places[itemIndex]} variant="default" />
				</Popup>
			)}
		</MapContainer>
	);
}
