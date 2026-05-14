import { Link } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import type { PlusIcon } from 'lucide-react';

type TIcon = typeof PlusIcon;

type Props = {
	to: string;
	params?: Record<string, unknown>;
	icon: TIcon;
	title: string;
	action?: TIcon;
};

export function DashboardLink({
	to,
	params,
	icon: Icon,
	title,
	action: ActionIcon,
}: Props) {
	return (
		<Link to={to} params={params}>
			<Item variant="outline" className="hover:bg-muted">
				<ItemMedia variant="icon">
					<Icon />
				</ItemMedia>
				<ItemContent>
					<ItemTitle>{title}</ItemTitle>
				</ItemContent>
				{ActionIcon && (
					<ItemActions>
						<Button variant="ghost">
							<ActionIcon />
						</Button>
					</ItemActions>
				)}
			</Item>
		</Link>
	);
}
