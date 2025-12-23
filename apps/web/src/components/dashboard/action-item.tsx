import {
	Item,
	ItemContent,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { cn } from '@wanderlust/ui/lib/utils';
import type { PaperclipIcon } from 'lucide-react';

type Props = {
	icon: typeof PaperclipIcon;
	text: string;
	className?: string;
};

export function DashboardActionItem({ className, icon: Icon, text }: Props) {
	return (
		<Item variant="outline" className={cn('hover:bg-muted', className)}>
			<ItemMedia variant="icon">
				<Icon />
			</ItemMedia>
			<ItemContent>
				<ItemTitle>{text}</ItemTitle>
			</ItemContent>
		</Item>
	);
}
