import { Content } from './content';
import { ConversationPanelContextProvider } from './context';
import type { ConversationPanelProps } from './types';

export function ConversationPanel(props: ConversationPanelProps) {
	return (
		<ConversationPanelContextProvider>
			<Content {...props} />
		</ConversationPanelContextProvider>
	);
}
