import React, { type PropsWithChildren, useState } from 'react';
import { createStore, type ExtractState, useStore } from 'zustand';
import { combine } from 'zustand/middleware';
import { computeRating } from '@/lib/rating';
import type { Place } from './types';

type Props = PropsWithChildren<{
	place: Place;
	meta?: {
		isFavorite: boolean;
	};
}>;

function createPlaceStore(place: Place, meta?: { isFavorite: boolean }) {
	return createStore(
		combine(
			{
				place,
				meta,
				index: 0,
				rating: computeRating(place.totalPoints, place.totalVotes),
				asset: place.assets[0],
			},
			(set, get) => ({
				setIndex: (index: number) => {
					set({ index, asset: get().place.assets[index] });
				},
			}),
		),
	);
}

type PlaceStoreApi = ReturnType<typeof createPlaceStore>;

const Context = React.createContext<PlaceStoreApi | null>(null);

export function PlaceStoreProvider({ children, place, meta }: Props) {
	const [store] = useState(() => createPlaceStore(place, meta));
	return <Context.Provider value={store}>{children}</Context.Provider>;
}

export function usePlaceStore<T>(
	selector: (state: ExtractState<PlaceStoreApi>) => T,
) {
	const store = React.useContext(Context);

	if (!store) {
		throw new Error('usePlaceStore must be used within a PlaceStoreProvider');
	}

	return useStore(store, selector);
}
