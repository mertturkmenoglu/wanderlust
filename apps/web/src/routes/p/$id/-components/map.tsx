import { getRouteApi } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { cn } from '@wanderlust/ui/lib/utils';
import { ExternalLinkIcon } from 'lucide-react';
import { useEffect } from 'react';
import MapContainer, { Marker, useMap } from 'react-map-gl/maplibre';
import { Pin } from '@/components/pin';
import { useMapStyle } from '@/hooks/use-map-style';

type Props = {
	className?: string;
};

export function MapComponent({ className }: Props) {
	const route = getRouteApi('/p/$id/');
	const { place } = route.useLoaderData();
	const lat = place.lat;
	const lng = place.lng;
	const zoom = 17;
	const style = useMapStyle();
	const map = useMap();

	useEffect(() => {
		return () => {
			map.current?.getMap().remove();
		};
	}, [map.current]);

	return (
		<div className={cn(className)}>
			<div className="flex items-end justify-between">
				<h3 className="font-semibold text-xl">Location</h3>
				<Button variant="link" className="px-0" size="sm" asChild>
					<a
						href={`https://www.google.com/maps/@${lat},${lng},${zoom}z`}
						target="_blank"
						rel="noopener noreferrer"
					>
						<ExternalLinkIcon className="size-3" />
						<span className="ml-1">Open in Maps</span>
					</a>
				</Button>
			</div>
			<MapContainer
				initialViewState={{
					longitude: lng,
					latitude: lat,
					zoom,
				}}
				dragPan={false}
				pitch={0}
				dragRotate={false}
				latitude={lat}
				longitude={lng}
				minZoom={14}
				style={{ width: '100%', height: '400px', marginTop: '16px', zIndex: 0 }}
				mapStyle={style}
			>
				<Marker latitude={lat} longitude={lng} anchor="bottom">
					<Pin />
				</Marker>
			</MapContainer>
		</div>
	);
}
