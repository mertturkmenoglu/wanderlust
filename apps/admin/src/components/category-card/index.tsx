import {
	Item,
	ItemActions,
	ItemContent,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { cn } from '@wanderlust/ui/lib/utils';
import type { Outputs } from '@/lib/orpc';

type Props = {
	className?: string;
	category: Outputs['categories']['get']['category'];
	children?: React.ReactNode;
};

export function CategoryCard({ className, category, children }: Props) {
	return (
		<Item variant="outline" className={cn(className)}>
			<ItemMedia variant="video">
				<img src={category.image} alt={category.name} />
			</ItemMedia>
			<ItemContent>
				<ItemTitle>{category.name}</ItemTitle>
			</ItemContent>

			{children && <ItemActions>{children}</ItemActions>}
		</Item>
	);
}
