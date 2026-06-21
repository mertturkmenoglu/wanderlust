import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@wanderlust/ui/components/dialog';
import { Content } from './content';
import { NewChatDialogContextProvider } from './context';

export function NewChatDialog() {
	return (
		<NewChatDialogContextProvider>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>New Chat</DialogTitle>
					<DialogDescription>
						Select a friend to start a new chat with.
					</DialogDescription>
				</DialogHeader>
				<Content />
			</DialogContent>
		</NewChatDialogContextProvider>
	);
}
