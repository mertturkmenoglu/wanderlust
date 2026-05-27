import MapContainer, { Marker } from 'react-map-gl/maplibre';
import { createStyle } from '@/lib/map';
import type { TBookmark } from './-hooks';

type Props = {
	bookmark: TBookmark;
};

const style = createStyle('streets-v2-light');

export function BookmarkItemMap({ bookmark }: Props) {
	const {
		place: { address },
	} = bookmark;

	return (
		<MapContainer
			initialViewState={{
				latitude: address.lat,
				longitude: address.lng,
				zoom: 15,
			}}
			dragPan={false}
			style={{
				width: '100%',
				height: '300px',
				zIndex: 0,
				marginTop: '16px',
			}}
			latitude={address.lat}
			longitude={address.lng}
			minZoom={12}
			mapStyle={style}
		>
			<Marker latitude={address.lat} longitude={address.lng} />
		</MapContainer>
	);
}
