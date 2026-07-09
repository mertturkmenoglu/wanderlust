import { createContext, useContext, useMemo, useState } from 'react';

type SortableListState<I = any> = {
	items: I[];
	setItems: React.Dispatch<React.SetStateAction<I[]>>;
};

const SortableListContext = createContext<SortableListState | null>(null);

export function SortableListProvider<I>({
	children,
	initial,
}: React.PropsWithChildren<{
	initial: I[];
}>) {
	const [items, setItems] = useState(initial);

	const state: SortableListState<I> = useMemo(() => {
		return {
			items,
			setItems,
		};
	}, [items]);

	return (
		<SortableListContext.Provider value={state}>
			{children}
		</SortableListContext.Provider>
	);
}

export function useSortableListContext<I>() {
	const ctx = useContext(SortableListContext) as SortableListState<I> | null;

	if (!ctx) {
		throw new Error(
			'useSortableListContext must be used within a SortableListProvider',
		);
	}

	return ctx;
}
