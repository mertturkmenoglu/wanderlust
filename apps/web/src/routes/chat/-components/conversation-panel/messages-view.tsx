import { cn } from '@wanderlust/ui/lib/utils';
import { NoMessagesView } from './no-messages';

type Props = {
	className?: string;
};

export function MessagesView({ className }: Props) {
	return (
		<div className={cn('bg-muted p-4 text-muted-foreground', className)}>
			<NoMessagesView />
		</div>
	);
}
