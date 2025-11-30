import MapContainer, { Marker } from 'react-map-gl/maplibre';
import { createStyle } from '@/lib/map';
import type { TBookmark } from './-types';

type Props = {
	bookmark: TBookmark;
};

export function BookmarkItemMap({ bookmark: { place } }: Props) {
	return (
		<MapContainer
			initialViewState={{
				latitude: place.address.lat,
				longitude: place.address.lng,
				zoom: 15,
			}}
			dragPan={false}
			style={{
				width: '100%',
				height: '300px',
				zIndex: 0,
				marginTop: '16px',
			}}
			latitude={place.address.lat}
			longitude={place.address.lng}
			minZoom={12}
			mapStyle={createStyle('streets-v2-light')}
		>
			<Marker latitude={place.address.lat} longitude={place.address.lng} />
		</MapContainer>
	);
}
