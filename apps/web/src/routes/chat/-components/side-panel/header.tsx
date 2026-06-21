import { Link } from '@tanstack/react-router';
import { Button, buttonVariants } from '@wanderlust/ui/components/button';
import { ButtonGroup } from '@wanderlust/ui/components/button-group';
import { DialogTrigger } from '@wanderlust/ui/components/dialog';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from '@wanderlust/ui/components/input-group';
import { cn } from '@wanderlust/ui/lib/utils';
import { PlusIcon, SearchIcon, Settings2Icon } from 'lucide-react';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { useChatContext } from '@/stores/chat-context';
import { NewChatDialog } from './new-chat-dialog';

type Props = {
	className?: string;
};

export function Header({ className }: Props) {
	const ctx = useChatContext();

	return (
		<div className={cn(className)}>
			<div className="flex flex-row items-center justify-between px-4 text-2xl">
				<div>Chats</div>
				<div className="flex flex-row items-center justify-end gap-2">
					<DialogTrigger asChild>
						<Button size="sm" onClick={() => ctx.setDialogType('new')}>
							<PlusIcon />
							New
						</Button>
					</DialogTrigger>
					<Link
						to="/settings/chat"
						className={buttonVariants({ size: 'sm', variant: 'outline' })}
					>
						<Settings2Icon />
						Settings
					</Link>
				</div>
			</div>

			<div className="mt-4 px-4">
				<form>
					<InputGroup>
						<InputGroupInput placeholder="Search chats..." />
						<InputGroupAddon align="inline-start">
							<SearchIcon className="text-muted-foreground" />
						</InputGroupAddon>
					</InputGroup>
				</form>

				<ButtonGroup className="mt-4">
					<Button size="sm" variant="default" className="w-20">
						All
					</Button>
					<Button size="sm" variant="outline" className="w-20">
						Unread
					</Button>
					<Button size="sm" variant="outline" className="w-20">
						Archived
					</Button>
				</ButtonGroup>
			</div>

			<SuspenseWrapper>
				{ctx.dialogType === 'new' && <NewChatDialog />}
			</SuspenseWrapper>
		</div>
	);
}
