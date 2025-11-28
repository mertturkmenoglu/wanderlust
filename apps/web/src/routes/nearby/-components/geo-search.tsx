/** biome-ignore-all lint/style/noNonNullAssertion: TODO */
import { Link } from '@tanstack/react-router';
import type { MapLibreEvent } from 'maplibre-gl';
import { useCallback, useEffect, useState } from 'react';
import { type UseGeoSearchProps, useGeoSearch } from 'react-instantsearch';
import { Marker, Popup, useMap } from 'react-map-gl/maplibre';
import { PlaceCard } from '@/components/blocks/place-card';

export function GeoSearch(props: UseGeoSearchProps) {
	const { items, refine } = useGeoSearch(props);
	const { current: map } = useMap();
	const [itemIndex, setItemIndex] = useState(-1);

	const onViewChange = useCallback(
		({ target }: MapLibreEvent) => {
			refine({
				northEast: target.getBounds().getNorthEast(),
				southWest: target.getBounds().getSouthWest(),
			});
		},
		[refine],
	);

	useEffect(() => {
		map?.on('zoomend', onViewChange);
		map?.on('dragend', onViewChange);

		// Cleanup on unmount
		return () => {
			map?.off('zoomend', onViewChange);
			map?.off('dragend', onViewChange);
		};
	}, [map, onViewChange]);

	return (
		<>
			{items.map((item, i) => (
				<Marker
					key={item.objectID}
					latitude={item._geoloc.lat}
					longitude={item._geoloc.lng}
					onClick={(e) => {
						e.originalEvent.stopPropagation();
						setItemIndex(i);
					}}
				/>
			))}

			{itemIndex !== -1 && (
				<Popup
					latitude={items[itemIndex]!._geoloc.lat}
					longitude={items[itemIndex]!._geoloc.lng}
					className="flex min-w-md items-center text-primary!"
				>
					<Link
						to="/p/$id"
						className="text-primary"
						params={{
							id: items[itemIndex]!.place.id,
						}}
					>
						<PlaceCard place={items[itemIndex]!.place} hoverEffects={false} />
					</Link>
				</Popup>
			)}
		</>
	);
}
