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

export const ConversationPanelContext = createContext<State | null>(null);

export function ConversationPanelContextProvider({
	children,
}: PropsWithChildren) {
	const [fooBar, setFooBar] = useState<string>('');

	const state = useMemo(() => {
		const state: State = {
			fooBar,
			setFooBar,
		};

		return state;
	}, [fooBar]);

	return (
		<ConversationPanelContext.Provider value={state}>
			{children}
		</ConversationPanelContext.Provider>
	);
}

export function useConversationPanelContext() {
	const context = useContext(ConversationPanelContext);

	if (!context) {
		throw new Error(
			'useConversationPanelContext must be used within a ConversationPanelContextProvider',
		);
	}

	return context;
}
