import {
	HomeIcon,
	MapPinIcon,
	NotepadTextIcon,
	PartyPopperIcon,
	PlaneIcon,
	UtensilsIcon,
} from 'lucide-react';
import type { ItineraryItemOption } from './types';

export const options = [
	{
		type: 'accommodation',
		label: 'Accommodation',
		icon: HomeIcon,
	},
	{
		type: 'transportation',
		label: 'Transportation',
		icon: PlaneIcon,
	},
	{
		type: 'event',
		label: 'Event',
		icon: PartyPopperIcon,
	},
	{
		type: 'location',
		label: 'Location',
		icon: MapPinIcon,
	},
	{
		type: 'dining',
		label: 'Dining',
		icon: UtensilsIcon,
	},
	{
		type: 'other',
		label: 'Other',
		icon: NotepadTextIcon,
	},
] as const satisfies ReadonlyArray<ItineraryItemOption>;
