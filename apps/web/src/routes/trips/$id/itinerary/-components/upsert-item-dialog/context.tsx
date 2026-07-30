import { type PropsWithChildren, useMemo, useState } from 'react';
import { ItineraryContext, type ItineraryItemType, type State } from './types';

export function ItineraryContextProvider({ children }: PropsWithChildren) {
	const [type, setType] = useState<ItineraryItemType | null>(null);
	const [open, setOpen] = useState(false);

	const state = useMemo(() => {
		const value: State = {
			type,
			setType,
			open,
			setOpen,
		};

		return value;
	}, [type, open]);

	return (
		<ItineraryContext.Provider value={state}>
			{children}
		</ItineraryContext.Provider>
	);
}
