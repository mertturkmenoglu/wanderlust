import { Button } from '@wanderlust/ui/components/button';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from '@wanderlust/ui/components/input-group';
import { Separator } from '@wanderlust/ui/components/separator';
import { cn } from '@wanderlust/ui/lib/utils';
import { EllipsisVerticalIcon, PlusIcon, SendIcon } from 'lucide-react';
import { Logo } from '@/components/logo';
import { useChatContext } from '@/stores/chat-context';
import { NoMessagesView } from './no-messages';
import { SelectChatView } from './select-chat';
import type { ConversationPanelProps } from './types';

export function Content({ className, ...props }: ConversationPanelProps) {
	const ctx = useChatContext();

	if (ctx.chatId === null) {
		return <SelectChatView className={className} />;
	}

	return (
		<div className={cn('flex flex-col', className)} {...props}>
			<div className="flex flex-row items-center justify-between gap-4 p-4">
				<div className="flex flex-row items-center gap-4">
					<Logo variant="xs" />
					<div className="text-lg">Clark Kent</div>
				</div>

				<div>
					<Button variant="ghost" size="icon-sm">
						<EllipsisVerticalIcon />
					</Button>
				</div>
			</div>

			<Separator className="" />

			<div className="flex flex-1 flex-col items-center justify-center bg-muted p-4 text-muted-foreground">
				<NoMessagesView />
			</div>

			<Separator />

			<div className="flex flex-row items-center gap-4 p-4">
				<InputGroup>
					<InputGroupInput placeholder="Type a message..." />
					<InputGroupAddon align="inline-start">
						<InputGroupButton>
							<PlusIcon />
							<span className="sr-only">Add attachments</span>
						</InputGroupButton>
					</InputGroupAddon>

					<InputGroupAddon align="inline-end">
						<InputGroupButton>
							<SendIcon />
							<span className="sr-only">Send message</span>
						</InputGroupButton>
					</InputGroupAddon>
				</InputGroup>
			</div>
		</div>
	);
}
