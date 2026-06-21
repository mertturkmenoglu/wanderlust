import { Separator } from '@wanderlust/ui/components/separator';
import { cn } from '@wanderlust/ui/lib/utils';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { ChatList } from './chat-list';
import { Header } from './header';
import type { SidePanelProps } from './types';

export function SidePanel({ className, ...props }: SidePanelProps) {
	return (
		<div className={cn('flex w-full flex-col', className)} {...props}>
			<Header className="mt-4" />

			<Separator className="my-4" />

			<SuspenseWrapper>
				<ChatList />
			</SuspenseWrapper>
		</div>
	);
}
