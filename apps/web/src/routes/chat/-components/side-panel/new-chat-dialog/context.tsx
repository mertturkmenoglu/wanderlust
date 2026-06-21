import { useDebouncedValue } from '@tanstack/react-pacer';
import {
	createContext,
	type Dispatch,
	type PropsWithChildren,
	type SetStateAction,
	useContext,
	useMemo,
	useState,
} from 'react';

type View = 'search' | 'send';

export type NewChatDialogUser = {
	id: string;
	name: string;
	username: string;
	image: string | null;
};

type State = {
	searchTerm: string;
	setSearchTerm: Dispatch<SetStateAction<string>>;
	debouncedSearchTerm: string;
	selectedUser: NewChatDialogUser | null;
	setSelectedUser: Dispatch<SetStateAction<NewChatDialogUser | null>>;
	isSearchQueryEnabled: boolean;
	view: View;
};

export const NewChatDialogContext = createContext<State | null>(null);

export function NewChatDialogContextProvider({ children }: PropsWithChildren) {
	const [searchTerm, setSearchTerm] = useState('');
	const [debouncedSearchTerm] = useDebouncedValue(searchTerm, {
		wait: 500,
	});
	const [selectedUser, setSelectedUser] = useState<NewChatDialogUser | null>(
		null,
	);
	const isSearchQueryEnabled = debouncedSearchTerm.length > 1;

	const state = useMemo(() => {
		const state: State = {
			searchTerm,
			setSearchTerm,
			debouncedSearchTerm,
			selectedUser,
			setSelectedUser,
			isSearchQueryEnabled,
			view: selectedUser !== null ? 'send' : 'search',
		};

		return state;
	}, [searchTerm, debouncedSearchTerm, selectedUser, isSearchQueryEnabled]);

	return (
		<NewChatDialogContext.Provider value={state}>
			{children}
		</NewChatDialogContext.Provider>
	);
}

export function useNewChatDialogContext() {
	const context = useContext(NewChatDialogContext);

	if (!context) {
		throw new Error(
			'useNewChatDialogContext must be used within a NewChatDialogContextProvider',
		);
	}

	return context;
}
