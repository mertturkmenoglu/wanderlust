import { Button } from '@wanderlust/ui/components/button';
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@wanderlust/ui/components/empty';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from '@wanderlust/ui/components/input-group';
import { Separator } from '@wanderlust/ui/components/separator';
import { cn } from '@wanderlust/ui/lib/utils';
import {
	ArrowUpRightIcon,
	EllipsisVerticalIcon,
	PlusIcon,
	SendIcon,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import type { ConversationPanelProps } from './types';

export function Content({ className, ...props }: ConversationPanelProps) {
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
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="default">
							<Logo variant="default" grayscale />
						</EmptyMedia>
						<EmptyTitle>No Messages Yet</EmptyTitle>
						<EmptyDescription>
							You haven&apos;t started any conversations yet. Get started by
							sending a message to Clark first.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent className="flex-row justify-center gap-2">
						Do not share any sensitive information in your messages. You can
						learn more about how to safely use Wanderlust in our help centre.
					</EmptyContent>
					<Button variant="link" className="text-muted-foreground" size="sm">
						Learn More <ArrowUpRightIcon />
					</Button>
				</Empty>
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
