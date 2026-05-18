import {
	createContext,
	type Dispatch,
	type PropsWithChildren,
	type SetStateAction,
	useContext,
} from 'react';
import { useLocalStorage } from '@/hooks/use-localstorage';

type State = {
	view: 'list' | 'grid';
	setView: Dispatch<SetStateAction<'list' | 'grid'>>;
};

export const ListContext = createContext<State | null>(null);

const key = 'wl-ldp-view';

export function ListContextProvider({ children }: PropsWithChildren) {
	const [view, setView] = useLocalStorage<'list' | 'grid'>(key, 'grid');

	return (
		<ListContext.Provider value={{ view, setView }}>
			{children}
		</ListContext.Provider>
	);
}

export function useListContext() {
	const context = useContext(ListContext);

	if (!context) {
		throw new Error('useListContext must be used within a ListContextProvider');
	}

	return context;
}
