import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { cn } from '@wanderlust/ui/lib/utils';
import { endOfYesterday, formatDistanceToNow, isBefore } from 'date-fns';
import { useMemo } from 'react';
import { Logo } from '@/components/logo';
import { UserImage } from '@/components/user-image';
import type { TChat } from '@/lib/chat';
import { truncateWithEllipses } from '@/lib/form';
import { userImage } from '@/lib/image';
import { useChatContext } from '@/stores/chat-context';

type Props = {
	chat: TChat;
};

export function ChatListItem({ chat }: Props) {
	const ctx = useChatContext();

	const title = useMemo(() => {
		return chat.name ?? chat.otherUser?.name ?? '-';
	}, [chat.name, chat.otherUser?.name]);

	const lastMessage = useMemo(() => {
		if (chat.lastMessage) {
			if (chat.lastMessage.body) {
				return truncateWithEllipses(chat.lastMessage.body, 30);
			}

			return `[${chat.lastMessage.type}]`;
		}

		return 'Start a conversation';
	}, [chat.lastMessage]);

	const lastMessageAt = useMemo(() => {
		if (chat.lastMessageAt) {
			const eodYesterday = endOfYesterday();

			if (isBefore(chat.lastMessageAt, eodYesterday)) {
				return formatDistanceToNow(chat.lastMessageAt, { addSuffix: true });
			}

			return new Date(chat.lastMessageAt).toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
			});
		}

		return '';
	}, [chat.lastMessageAt]);

	return (
		<button
			type="button"
			className="text-left"
			onClick={() => ctx.setChatId(chat.id)}
		>
			<Item
				variant="outline"
				className={cn({
					'hover:bg-muted': chat.id !== ctx.chatId,
					'border border-primary': chat.id === ctx.chatId,
				})}
			>
				<ItemMedia>
					{chat.otherUser ? (
						<UserImage src={userImage(chat.otherUser.image)} />
					) : (
						<Logo variant="xs" />
					)}
				</ItemMedia>
				<ItemContent>
					<ItemTitle>{title}</ItemTitle>
					<ItemDescription>{lastMessage}</ItemDescription>
				</ItemContent>
				<ItemActions>
					<div className="text-muted-foreground text-xs leading-0 tracking-tighter">
						{lastMessageAt}
					</div>
				</ItemActions>
			</Item>
		</button>
	);
}
