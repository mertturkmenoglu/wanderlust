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
	address: Outputs['addresses']['get']['address'];
	children?: React.ReactNode;
};

export function AddressCard({ className, address, children }: Props) {
	return (
		<Item variant="outline" className={cn(className)}>
			<ItemMedia variant="video">
				<img src={address.city.image} alt={address.city.name} />
			</ItemMedia>
			<ItemContent>
				<ItemTitle>{address.line1}</ItemTitle>
				<ItemDescription>{address.line2 ?? '—'}</ItemDescription>
				<ItemDescription>
					{address.city.name} / {address.city.countryCode}
				</ItemDescription>
			</ItemContent>

			{children && <ItemActions>{children}</ItemActions>}
		</Item>
	);
}
