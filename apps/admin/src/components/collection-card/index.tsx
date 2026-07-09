import {
	Item,
	ItemActions,
	ItemContent,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { cn } from '@wanderlust/ui/lib/utils';
import type { Outputs } from '@/lib/orpc';

type Props = {
	className?: string;
	collection: Omit<Outputs['collections']['get']['collection'], 'items'>;
	children?: React.ReactNode;
};

export function CollectionCard({ className, collection, children }: Props) {
	return (
		<Item variant="outline" className={cn(className)}>
			<ItemContent>
				<ItemTitle>{collection.name}</ItemTitle>
			</ItemContent>

			{children && <ItemActions>{children}</ItemActions>}
		</Item>
	);
}
