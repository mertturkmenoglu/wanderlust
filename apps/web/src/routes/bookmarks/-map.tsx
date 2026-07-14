import MapContainer, { Marker } from 'react-map-gl/maplibre';
import { Pin } from '@/components/pin';
import { useMapStyle } from '@/hooks/use-map-style';
import type { TBookmark } from './-hooks';

type Props = {
	bookmark: TBookmark;
};

export function BookmarkItemMap({ bookmark }: Props) {
	const style = useMapStyle();

	const place = bookmark.place;

	return (
		<MapContainer
			initialViewState={{
				latitude: place.lat,
				longitude: place.lng,
				zoom: 15,
			}}
			dragPan={false}
			style={{
				width: '100%',
				height: '300px',
				zIndex: 0,
				marginTop: '16px',
			}}
			latitude={place.lat}
			longitude={place.lng}
			minZoom={12}
			mapStyle={style}
		>
			<Marker latitude={place.lat} longitude={place.lng} anchor="bottom">
				<Pin />
			</Marker>
		</MapContainer>
	);
}
