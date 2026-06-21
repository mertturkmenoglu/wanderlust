import { ItemGroup } from '@wanderlust/ui/components/item';
import { ScrollArea } from '@wanderlust/ui/components/scroll-area';
import { cn } from '@wanderlust/ui/lib/utils';
import { EmptyState } from './empty';
import { useChatListQuery } from './hooks';
import { ChatListItem } from './item';

type Props = {
	className?: string;
};

export function ChatList({ className }: Props) {
	const query = useChatListQuery();
	const chats = query.data.chats;

	if (chats.length === 0) {
		return <EmptyState />;
	}

	return (
		<ScrollArea className={cn('min-h-0 flex-1', className)} type="auto">
			<ItemGroup className="gap-2 px-4 pb-4">
				{chats.map((chat) => (
					<ChatListItem key={chat.id} chat={chat} />
				))}
			</ItemGroup>
		</ScrollArea>
	);
}
