import { Separator } from '@wanderlust/ui/components/separator';
import { cn } from '@wanderlust/ui/lib/utils';
import { useChatContext } from '@/stores/chat-context';
import { Header } from './header';
import { ChatInput } from './input';
import { MessagesView } from './messages-view';
import { SelectChatView } from './select-chat';
import type { ConversationPanelProps } from './types';

export function Content({ className, ...props }: ConversationPanelProps) {
	const ctx = useChatContext();

	if (ctx.chatId === null) {
		return <SelectChatView className={className} />;
	}

	return (
		<div className={cn('flex flex-col', className)} {...props}>
			<Header className="p-4" />

			<Separator />

			<MessagesView className="flex flex-1 flex-col items-center justify-center" />

			<Separator />

			<div className="p-4">
				<ChatInput />
			</div>
		</div>
	);
}
