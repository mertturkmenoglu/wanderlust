import type { LucideIcon } from 'lucide-react';
import { createContext, type Dispatch, type SetStateAction } from 'react';

export type ItineraryItemType =
	| 'accommodation'
	| 'transportation'
	| 'event'
	| 'location'
	| 'dining'
	| 'other';

export type ItineraryItemOption = Readonly<{
	type: ItineraryItemType;
	label: string;
	icon: LucideIcon;
}>;

export type State = {
	type: ItineraryItemType | null;
	setType: Dispatch<SetStateAction<ItineraryItemType | null>>;
};

export const ItineraryContext = createContext<State | null>(null);
