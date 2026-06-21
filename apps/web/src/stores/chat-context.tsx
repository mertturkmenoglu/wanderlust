import { skipToken, useQuery } from '@tanstack/react-query';
import {
	createContext,
	type Dispatch,
	type PropsWithChildren,
	type SetStateAction,
	useContext,
	useMemo,
	useState,
} from 'react';
import { chatRpc, type TChat } from '@/lib/chat';

export type ChatDialogType = 'new' | null;

type State = {
	isSidePanelExpanded: boolean;
	setIsSidePanelExpanded: Dispatch<SetStateAction<boolean>>;
	chatId: string | null;
	setChatId: Dispatch<SetStateAction<string | null>>;
	dialogType: ChatDialogType;
	setDialogType: Dispatch<SetStateAction<ChatDialogType>>;
	chat: TChat | null;
};

export const ChatContext = createContext<State | null>(null);

export function ChatContextProvider({ children }: PropsWithChildren) {
	const [isSidePanelExpanded, setIsSidePanelExpanded] = useState<boolean>(true);
	const [chatId, setChatId] = useState<string | null>(null);
	const [dialogType, setDialogType] = useState<ChatDialogType>(null);

	const query = useQuery(
		chatRpc.chat.info.queryOptions({
			input: chatId ? { id: chatId } : skipToken,
		}),
	);

	const state = useMemo(() => {
		const state: State = {
			isSidePanelExpanded,
			setIsSidePanelExpanded,
			chatId,
			setChatId,
			dialogType,
			setDialogType,
			chat: query.data?.chat ?? null,
		};

		return state;
	}, [isSidePanelExpanded, chatId, dialogType, query.data]);

	return <ChatContext.Provider value={state}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
	const context = useContext(ChatContext);

	if (!context) {
		throw new Error('useChatContext must be used within a ChatContextProvider');
	}

	return context;
}
