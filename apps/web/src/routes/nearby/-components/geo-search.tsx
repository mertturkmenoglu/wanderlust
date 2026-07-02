import { Link } from '@tanstack/react-router';
import type { MapLibreEvent } from 'maplibre-gl';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { type UseGeoSearchProps, useGeoSearch } from 'react-instantsearch';
import { Marker, Popup, useMap } from 'react-map-gl/maplibre';
import { Pin } from '@/components/pin';
import { PlaceCard } from '@/components/place-card';

export function GeoSearch(props: UseGeoSearchProps) {
	const { items, refine } = useGeoSearch(props);
	const { current: map } = useMap();
	const [itemIndex, setItemIndex] = useState(-1);

	const onViewChange = useCallback(
		({ target }: MapLibreEvent) => {
			if (itemIndex !== -1) {
				return;
			}

			refine({
				northEast: target.getBounds().getNorthEast(),
				southWest: target.getBounds().getSouthWest(),
			});
			setItemIndex(-1);
		},
		[refine, itemIndex],
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

	const markers = useMemo(() => {
		return items.map((item, i) => {
			return (
				<Marker
					key={`marker-${item.objectID}`}
					latitude={item._geoloc.lat}
					longitude={item._geoloc.lng}
					onClick={(e) => {
						e.originalEvent.stopPropagation();
						setItemIndex(i);
					}}
					anchor="bottom"
				>
					<Pin />
				</Marker>
			);
		});
	}, [items]);

	return (
		<>
			{markers}

			{itemIndex !== -1 && items[itemIndex] && (
				<Popup
					onClose={() => setItemIndex(-1)}
					latitude={items[itemIndex]._geoloc.lat}
					longitude={items[itemIndex]._geoloc.lng}
					closeButton={false}
					anchor="top"
					closeOnMove={false}
					className="flex min-w-md p-0! [&>div:nth-child(2)]:rounded-md! [&>div:nth-child(2)]:bg-none! [&>div:nth-child(2)]:p-0! [&>div:nth-child(2)]:shadow-none!"
				>
					<Link
						to="/p/$id"
						params={{
							id: items[itemIndex].place.id,
						}}
					>
						<PlaceCard place={items[itemIndex].place} variant="default" />
					</Link>
				</Popup>
			)}
		</>
	);
}
