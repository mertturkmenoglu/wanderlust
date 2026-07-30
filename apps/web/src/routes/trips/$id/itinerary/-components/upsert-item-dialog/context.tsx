import { type PropsWithChildren, useMemo, useState } from 'react';
import {
	ItineraryContext,
	type ItineraryItemType,
	type State,
	type UpsertItemDialogProps,
} from './types';

export function ItineraryContextProvider({
	children,
	item,
}: PropsWithChildren<UpsertItemDialogProps>) {
	const [type, setType] = useState<ItineraryItemType | null>(() => {
		if (item) {
			return item.type;
		}

		return null;
	});

	const [open, setOpen] = useState(false);

	const state = useMemo(() => {
		const value: State = {
			type,
			setType,
			open,
			setOpen,
			initialItem: item,
			mode: item ? 'edit' : 'create',
		};

		return value;
	}, [type, open, item]);

	return (
		<ItineraryContext.Provider value={state}>
			{children}
		</ItineraryContext.Provider>
	);
}
