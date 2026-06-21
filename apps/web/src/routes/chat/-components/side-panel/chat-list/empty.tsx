import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@wanderlust/ui/components/empty';
import { InboxIcon } from 'lucide-react';

export function EmptyState() {
	return (
		<Empty className="text-muted-foreground">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<InboxIcon className="text-muted-foreground" />
				</EmptyMedia>
				<EmptyTitle className="text-muted-foreground">No chats yet.</EmptyTitle>
				<EmptyDescription>
					Click "New Chat" to start a conversation.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
