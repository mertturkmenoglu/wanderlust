import { Link } from '@tanstack/react-router';
import type { ComponentIcon } from 'lucide-react';
import { ArrowRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemMedia,
	ItemTitle,
} from '@/components/ui/item';

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
