import {
	createContext,
	type Dispatch,
	type PropsWithChildren,
	type SetStateAction,
	useContext,
	useMemo,
	useState,
} from 'react';

type State = {
	listId: string | null;
	setListId: Dispatch<SetStateAction<string | null>>;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	newListDialogOpen: boolean;
	setNewListDialogOpen: Dispatch<SetStateAction<boolean>>;
};

export const AddToListContext = createContext<State | null>(null);

export function AddToListContextProvider({ children }: PropsWithChildren) {
	const [listId, setListId] = useState<string | null>(null);
	const [open, setOpen] = useState<boolean>(false);
	const [newListDialogOpen, setNewListDialogOpen] = useState<boolean>(false);

	const state = useMemo(() => {
		const state: State = {
			listId,
			setListId,
			open,
			setOpen,
			newListDialogOpen,
			setNewListDialogOpen,
		};

		return state;
	}, [listId, open, newListDialogOpen]);

	return (
		<AddToListContext.Provider value={state}>
			{children}
		</AddToListContext.Provider>
	);
}

export function useAddToListContext() {
	const context = useContext(AddToListContext);

	if (!context) {
		throw new Error(
			'useAddToListContext must be used within a AddToListContextProvider',
		);
	}

	return context;
}
