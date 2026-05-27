import { cn } from '@wanderlust/ui/lib/utils';
import { PlaceCard } from '@/components/place-card';
import { useCollectionQuery } from './-hooks';

type Props = {
	className?: string;
};

export function Items({ className }: Props) {
	const query = useCollectionQuery();
	const { collection } = query.data;

	return (
		<div
			className={cn(
				'grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4',
				className,
			)}
		>
			{collection.items.map((item) => (
				<PlaceCard place={item.place} key={item.placeId} as="link" />
			))}
		</div>
	);
}
