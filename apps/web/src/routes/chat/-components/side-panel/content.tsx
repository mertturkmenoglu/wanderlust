import { Link } from '@tanstack/react-router';
import { Button, buttonVariants } from '@wanderlust/ui/components/button';
import { ButtonGroup } from '@wanderlust/ui/components/button-group';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from '@wanderlust/ui/components/input-group';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { ScrollArea } from '@wanderlust/ui/components/scroll-area';
import { Separator } from '@wanderlust/ui/components/separator';
import { cn } from '@wanderlust/ui/lib/utils';
import { PlusIcon, SearchIcon, Settings2Icon } from 'lucide-react';
import { Logo } from '@/components/logo';
import type { SidePanelProps } from './types';

export function Content({ className, ...props }: SidePanelProps) {
	const chats = new Array(30).fill(null).map((_, i) => ({
		id: i + 1,
		name: `Chat ${i + 1}`,
		lastMessage: `This is the last message of chat ${i + 1}`,
		lastMessageTime: new Date(Date.now() - i * 60000).toISOString(),
	}));

	return (
		<div className={cn('flex w-full flex-col', className)} {...props}>
			<div className="mt-4 flex flex-row items-center justify-between px-4 text-2xl">
				<div>Chats</div>
				<div className="flex flex-row items-center justify-end gap-2">
					<Button size="sm">
						<PlusIcon />
						New
					</Button>
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

			<Separator className="my-4" />

			<ScrollArea className="min-h-0 flex-1" type="auto">
				<ItemGroup className="gap-2 px-4 pb-4">
					{chats.map((chat) => (
						<Item key={chat.id} variant="outline">
							<ItemMedia>
								<Logo variant="xs" />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>{chat.name}</ItemTitle>
								<ItemDescription>{chat.lastMessage}</ItemDescription>
							</ItemContent>
							<ItemActions>
								<div className="text-muted-foreground text-xs leading-0 tracking-tighter">
									{new Date(chat.lastMessageTime).toLocaleTimeString([], {
										hour: '2-digit',
										minute: '2-digit',
									})}
								</div>
							</ItemActions>
						</Item>
					))}
				</ItemGroup>
			</ScrollArea>
		</div>
	);
}
