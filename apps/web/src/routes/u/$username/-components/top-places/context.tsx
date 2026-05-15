import {
	createContext,
	type Dispatch,
	type PropsWithChildren,
	type SetStateAction,
	useContext,
	useState,
} from 'react';
import type { Outputs } from '@/lib/orpc';

type PlaceItem = Outputs['places']['get']['place'];

type State = {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	mode: 'items' | 'search';
	setMode: Dispatch<SetStateAction<'items' | 'search'>>;
	items: PlaceItem[];
	setItems: Dispatch<SetStateAction<PlaceItem[]>>;
};

export const TopPlacesContext = createContext<State | null>(null);

export function TopPlacesContextProvider({ children }: PropsWithChildren) {
	const [open, setOpen] = useState(false);
	const [mode, setMode] = useState<'items' | 'search'>('items');
	const [items, setItems] = useState<PlaceItem[]>([]);

	return (
		<TopPlacesContext.Provider
			value={{ open, setOpen, mode, setMode, items, setItems }}
		>
			{children}
		</TopPlacesContext.Provider>
	);
}

export function useTopPlacesContext() {
	const context = useContext(TopPlacesContext);

	if (!context) {
		throw new Error(
			'useTopPlacesContext must be used within a TopPlacesContextProvider',
		);
	}

	return context;
}
