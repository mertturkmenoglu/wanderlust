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
	fooBar: string;
	setFooBar: Dispatch<SetStateAction<string>>;
};

export const SidePanelContext = createContext<State | null>(null);

export function SidePanelContextProvider({ children }: PropsWithChildren) {
	const [fooBar, setFooBar] = useState<string>('');

	const state = useMemo(() => {
		const state: State = {
			fooBar,
			setFooBar,
		};

		return state;
	}, [fooBar]);

	return (
		<SidePanelContext.Provider value={state}>
			{children}
		</SidePanelContext.Provider>
	);
}

export function useSidePanelContext() {
	const context = useContext(SidePanelContext);

	if (!context) {
		throw new Error(
			'useSidePanelContext must be used within a SidePanelContextProvider',
		);
	}

	return context;
}
