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

export function NoMessagesView({ className }: Props) {
	return (
		<Empty className={cn(className)}>
			<EmptyHeader>
				<EmptyMedia variant="default">
					<Logo variant="default" grayscale />
				</EmptyMedia>
				<EmptyTitle>No Messages Yet</EmptyTitle>
				<EmptyDescription>
					You haven&apos;t started any conversations yet. Get started by sending
					a message to Clark first.
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
