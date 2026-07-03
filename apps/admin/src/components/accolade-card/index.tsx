import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { cn } from '@wanderlust/ui/lib/utils';
import type { Outputs } from '@/lib/orpc';

type Props = {
	className?: string;
	accolade: Outputs['accolades']['get']['accolade'];
	children?: React.ReactNode;
};

export function AccoladeCard({ className, accolade, children }: Props) {
	return (
		<Item variant="outline" className={cn(className)}>
			<ItemMedia variant="video">
				<img src={accolade.image} alt={accolade.title} />
			</ItemMedia>
			<ItemContent>
				<ItemTitle>{accolade.title}</ItemTitle>
				<ItemDescription>{accolade.description ?? '—'}</ItemDescription>
			</ItemContent>

			{children && <ItemActions>{children}</ItemActions>}
		</Item>
	);
}
