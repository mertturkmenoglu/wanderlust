import { useItineraryContext } from './hooks';
import type { ItineraryItemType } from './types';
import { AccommodationView } from './views/accommodation-view';
import { DiningView } from './views/dining-view';
import { EventView } from './views/event-view';
import { LocationView } from './views/location-view';
import { OtherView } from './views/other-view';
import { SelectionView } from './views/selection-view';
import { TransportationView } from './views/transportation-view';

const mapping = {
	accommodation: AccommodationView,
	dining: DiningView,
	event: EventView,
	location: LocationView,
	other: OtherView,
	transportation: TransportationView,
} as const satisfies Record<ItineraryItemType, () => JSX.Element>;

export function mux() {
	const ctx = useItineraryContext();

	if (ctx.type === null) {
		return SelectionView;
	}

	return mapping[ctx.type];
}
