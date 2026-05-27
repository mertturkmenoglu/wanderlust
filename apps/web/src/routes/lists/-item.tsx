import { Link } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRightIcon, GlobeIcon, LockIcon } from 'lucide-react';
import type { TList } from './-hooks';

type Props = {
	list: TList;
};

export function ItemComponent({ list }: Props) {
	return (
		<Link
			to="/lists/$id"
			params={{
				id: list.id,
			}}
		>
			<Item variant="outline" className="hover:bg-muted">
				<ItemMedia variant="icon">
					{list.isPublic ? <GlobeIcon /> : <LockIcon />}
				</ItemMedia>
				<ItemContent>
					<ItemTitle>{list.name}</ItemTitle>
					<ItemDescription
						title={`Created at ${new Date(list.createdAt).toLocaleString()}`}
					>
						Created {formatDistanceToNow(list.createdAt, { addSuffix: true })}
					</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Button variant="ghost" size="icon">
						<ArrowRightIcon />
					</Button>
				</ItemActions>
			</Item>
		</Link>
	);
}
