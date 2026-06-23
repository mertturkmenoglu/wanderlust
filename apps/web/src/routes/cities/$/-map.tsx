import { useLoaderData } from '@tanstack/react-router';
import MapContainer from 'react-map-gl/maplibre';
import { useMapStyle } from '@/hooks/use-map-style';

export function MapComponent() {
	const { city } = useLoaderData({ from: '/cities/$/' });
	const { lat: latitude, lng: longitude } = city;
	const style = useMapStyle();

	return (
		<>
			<h3 className="mt-8 text-lg md:text-2xl lg:mt-4">Location</h3>
			<div className="mt-4">
				<MapContainer
					initialViewState={{
						latitude,
						longitude,
						zoom: 14,
						pitch: 0,
						bearing: 0,
					}}
					mapStyle={style}
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
