import { Link } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { formatDistanceToNow } from 'date-fns';
import { ChevronRightIcon, MinusIcon } from 'lucide-react';
import type { Outputs } from '@/lib/orpc';
import { toTitleCase } from '@/lib/text';

type Props = {
	list: Outputs['lists']['listPublic']['lists'][number];
};

export function ListingItem({ list }: Props) {
	return (
		<Link
			to="/lists/$id"
			params={{
				id: list.id,
			}}
		>
			<Item variant="outline" className="hover:bg-muted">
				<ItemActions>
					<Button variant="outline" size="icon-sm">
						<MinusIcon />
					</Button>
				</ItemActions>
				<ItemContent>
					<ItemTitle>{list.name}</ItemTitle>
					<ItemDescription>
						{toTitleCase(`Updated ${formatDistanceToNow(list.updatedAt)} ago`)}
					</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Button variant="secondary" size="icon">
						<ChevronRightIcon />
					</Button>
				</ItemActions>
			</Item>
		</Link>
	);
}
