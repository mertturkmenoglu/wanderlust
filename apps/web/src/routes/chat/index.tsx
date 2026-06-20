import { createFileRoute } from '@tanstack/react-router';
import { Dialog } from '@wanderlust/ui/components/dialog';
import { authGuard } from '@/lib/auth';
import { ConversationPanel } from './-components/conversation-panel';
import { SidePanel } from './-components/side-panel';
import { ChatContextProvider } from './-context';

export const Route = createFileRoute('/chat/')({
	component: RouteComponent,
	beforeLoad: authGuard,
});

function RouteComponent() {
	return (
		<ChatContextProvider>
			<Dialog>
				<div className="flex min-h-0 flex-1 items-stretch rounded-lg border border-border">
					<SidePanel className="max-w-md rounded-r-none border-border border-r" />

					<ConversationPanel className="flex-1" />
				</div>
			</Dialog>
		</ChatContextProvider>
	);
}
