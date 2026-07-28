import { type PropsWithChildren, useMemo, useState } from 'react';
import { ItineraryContext, type ItineraryItemType, type State } from './types';

export function ItineraryContextProvider({ children }: PropsWithChildren) {
	const [type, setType] = useState<ItineraryItemType | null>(null);

	const state = useMemo(() => {
		const value: State = {
			type,
			setType,
		};

		return value;
	}, [type]);

	return (
		<ItineraryContext.Provider value={state}>
			{children}
		</ItineraryContext.Provider>
	);
}
