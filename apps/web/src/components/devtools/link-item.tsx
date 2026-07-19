import {
	Item,
	ItemContent,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import type { LucideIcon } from 'lucide-react';

type Props = {
	href: string;
	icon: LucideIcon;
	text: string;
};

export function LinkItem(props: Props) {
	return (
		<a href={props.href} target="_blank" rel="noopener noreferrer">
			<Item size="xs" className="hover:bg-muted">
				<ItemMedia variant="icon">
					<props.icon />
				</ItemMedia>
				<ItemContent>
					<ItemTitle>{props.text}</ItemTitle>
				</ItemContent>
			</Item>
		</a>
	);
}
