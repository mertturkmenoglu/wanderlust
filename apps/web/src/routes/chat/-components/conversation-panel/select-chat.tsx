import { Link } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@wanderlust/ui/components/empty';
import { cn } from '@wanderlust/ui/lib/utils';
import { ArrowUpRightIcon } from 'lucide-react';
import { Logo } from '@/components/logo';

type Props = {
	className?: string;
};

export function SelectChatView({ className }: Props) {
	return (
		<Empty className={cn(className)}>
			<EmptyHeader>
				<EmptyMedia variant="default">
					<Logo variant="default" grayscale />
				</EmptyMedia>
				<EmptyTitle>Select a chat</EmptyTitle>
				<EmptyDescription>
					Select a chat from the list on the left or start a new conversation by
					sending the first message.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent className="flex-row justify-center gap-2 text-muted-foreground text-xs">
				Do not share any sensitive information in your messages. You can learn
				more about how to safely use Wanderlust in our help centre.
			</EmptyContent>
			<Link
				to="/help"
				className={buttonVariants({ variant: 'link', size: 'sm' })}
			>
				Learn More <ArrowUpRightIcon />
			</Link>
		</Empty>
	);
}
