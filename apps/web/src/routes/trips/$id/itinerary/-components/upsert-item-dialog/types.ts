import type { LucideIcon } from 'lucide-react';
import { createContext, type Dispatch, type SetStateAction } from 'react';
import type { Outputs } from '@/lib/orpc';

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
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	initialItem?: ItineraryItem;
	mode: 'create' | 'edit';
};

export const ItineraryContext = createContext<State | null>(null);

export type ItineraryItem =
	Outputs['trips']['get']['trip']['itineraryItems'][number];

export type UpsertItemDialogProps = {
	item?: ItineraryItem;
};
