import { Link } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import type { ComponentIcon } from 'lucide-react';
import { ArrowRightIcon } from 'lucide-react';

type TIcon = typeof ComponentIcon;

type Props = {
	href: string;
	text: string;
	icon: TIcon;
};

export function DashboardItem({ href, text, icon: Icon }: Props) {
	return (
		<Link to={href}>
			<Item variant="outline" className="hover:bg-muted">
				<ItemMedia variant="icon">
					<Icon />
				</ItemMedia>
				<ItemContent>
					<ItemTitle>{text}</ItemTitle>
				</ItemContent>
				<ItemActions>
					<Button variant="ghost">
						<ArrowRightIcon />
					</Button>
				</ItemActions>
			</Item>
		</Link>
	);
}
