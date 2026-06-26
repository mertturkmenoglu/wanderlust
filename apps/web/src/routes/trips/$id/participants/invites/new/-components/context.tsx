import { useDebouncedValue } from '@tanstack/react-pacer';
import {
	createContext,
	type Dispatch,
	type PropsWithChildren,
	type SetStateAction,
	useContext,
	useState,
} from 'react';

type State = {
	search: string;
	setSearch: Dispatch<SetStateAction<string>>;
	debounced: string;
	isQueryEnabled: boolean;
};

export const TripCreateInviteContext = createContext<State | null>(null);

type Props = PropsWithChildren;

export function TripCreateInviteContextProvider({ children }: Props) {
	const [search, setSearch] = useState('');
	const [debounced] = useDebouncedValue(search, {
		wait: 500,
	});

	return (
		<TripCreateInviteContext.Provider
			value={{
				search,
				setSearch,
				debounced,
				isQueryEnabled: debounced.length > 1,
			}}
		>
			{children}
		</TripCreateInviteContext.Provider>
	);
}

export function useTripCreateInviteContext() {
	const context = useContext(TripCreateInviteContext);

	if (!context) {
		throw new Error(
			'useTripCreateInviteContext must be used within a TripCreateInviteContextProvider',
		);
	}

	return context;
}
