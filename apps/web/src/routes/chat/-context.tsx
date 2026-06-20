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
	isSidePanelExpanded: boolean;
	setIsSidePanelExpanded: Dispatch<SetStateAction<boolean>>;
};

export const ChatContext = createContext<State | null>(null);

export function ChatContextProvider({ children }: PropsWithChildren) {
	const [isSidePanelExpanded, setIsSidePanelExpanded] = useState<boolean>(true);

	const state = useMemo(() => {
		const state: State = {
			isSidePanelExpanded,
			setIsSidePanelExpanded,
		};

		return state;
	}, [isSidePanelExpanded]);

	return <ChatContext.Provider value={state}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
	const context = useContext(ChatContext);

	if (!context) {
		throw new Error('useChatContext must be used within a ChatContextProvider');
	}

	return context;
}
