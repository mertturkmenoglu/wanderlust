import { useContext } from 'react';
import { ItineraryContext, type State } from './types';

export function useItineraryContext() {
	const context = useContext(ItineraryContext);

	if (!context) {
		throw new Error(
			'useItineraryContext must be used within a ItineraryContextProvider',
		);
	}

	return context as State;
}
