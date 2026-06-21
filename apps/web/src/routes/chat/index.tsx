import { createFileRoute } from '@tanstack/react-router';
import { Dialog } from '@wanderlust/ui/components/dialog';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { authGuard } from '@/lib/auth';
import { ChatContextProvider, useChatContext } from '@/stores/chat-context';
import { ConversationPanel } from './-components/conversation-panel';
import { SidePanel } from './-components/side-panel';

export const Route = createFileRoute('/chat/')({
	component: RouteComponent,
	beforeLoad: authGuard,
});

function RouteComponent() {
	return (
		<ChatContextProvider>
			<Container />
		</ChatContextProvider>
	);
}

function Container() {
	const ctx = useChatContext();

	return (
		<Dialog
			open={ctx.dialogType !== null}
			onOpenChange={(open) => {
				if (!open) {
					ctx.setDialogType(null);
				}
			}}
		>
			<div className="flex min-h-0 flex-1 items-stretch rounded-lg border border-border">
				<SidePanel className="max-w-md rounded-r-none border-border border-r" />

				<SuspenseWrapper>
					<ConversationPanel className="flex-1" />
				</SuspenseWrapper>
			</div>
		</Dialog>
	);
}
