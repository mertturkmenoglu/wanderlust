import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from '@wanderlust/ui/components/input-group';
import { cn } from '@wanderlust/ui/lib/utils';
import { PlusIcon, SendIcon } from 'lucide-react';

type Props = {
	className?: string;
};

export function ChatInput({ className }: Props) {
	return (
		<InputGroup className={cn(className)}>
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
	);
}
