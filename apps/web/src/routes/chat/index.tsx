import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { Dialog } from '@wanderlust/ui/components/dialog';
import {
	Sheet,
	SheetContent,
	SheetTrigger,
} from '@wanderlust/ui/components/sheet';
import { PanelLeftOpenIcon } from 'lucide-react';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { authGuard } from '@/lib/auth';
import { seo } from '@/lib/seo';
import { ChatContextProvider, useChatContext } from '@/stores/chat-context';
import { ConversationPanel } from './-components/conversation-panel';
import { SidePanel } from './-components/side-panel';

export const Route = createFileRoute('/chat/')({
	component: RouteComponent,
	ssr: false,
	beforeLoad: authGuard,
	head: () =>
		seo({
			title: 'Chat',
		}),
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
			<Sheet>
				<SheetTrigger className="md:hidden" asChild>
					<Button variant="midnight" size="default" className="max-w-fit px-4">
						<PanelLeftOpenIcon />
						<span>Open</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left">
					<SidePanel className="mt-8 max-w-md rounded-r-none border-border border-r" />
				</SheetContent>
			</Sheet>

			<div className="mt-4 flex min-h-0 flex-1 flex-col items-stretch rounded-lg border border-border md:mt-0 md:flex-row">
				<SidePanel className="hidden max-w-md rounded-r-none border-border border-r md:block" />

				<SuspenseWrapper>
					<ConversationPanel className="flex-1" />
				</SuspenseWrapper>
			</div>
		</Dialog>
	);
}
