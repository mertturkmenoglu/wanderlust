import MapContainer from 'react-map-gl/maplibre';
import { createStyle } from '@/lib/map';

type Props = {
	latitude: number;
	longitude: number;
};

export function MapComponent({ latitude, longitude }: Props) {
	return (
		<>
			<h3 className="mt-8 font-bold text-2xl lg:mt-4">Location</h3>
			<div className="mt-4">
				<MapContainer
					initialViewState={{
						latitude,
						longitude,
						zoom: 14,
						pitch: 0,
						bearing: 0,
					}}
					mapStyle={createStyle('streets-v2-light')}
					dragPan={false}
					dragRotate={false}
					minZoom={10}
					scrollZoom
					style={{
						height: '400px',
						marginTop: '16px',
						zIndex: 0,
						width: '100%',
					}}
				/>
			</div>
		</>
	);
}
