import { ScrollArea, ScrollBar } from '@wanderlust/ui/components/scroll-area';
import { cn } from '@wanderlust/ui/lib/utils';
import type { Outputs } from '@/lib/orpc';
import { PlaceCard } from '../place-card';
import { UnderlineLink } from '../underline-link';

type TCollection = Outputs['collections']['get']['collection'];

export type CollectionProps = {
	collection: TCollection;
	className?: string;
};

export function Collection({ collection, className }: CollectionProps) {
	return (
		<div className={cn(className)}>
			<div className="mb-4 flex items-baseline justify-between gap-4 md:justify-start">
				<div className="line-clamp-1 text-lg md:text-2xl">
					{collection.name}
				</div>
				<UnderlineLink
					to="/collections/$id"
					params={{
						id: collection.id,
					}}
				>
					See more
				</UnderlineLink>
			</div>

			<ScrollArea>
				<div className="my-4 flex gap-8">
					{collection.items.map((item) => (
						<PlaceCard
							key={item.placeId}
							place={item.place}
							meta={item.meta}
							className="w-[256px]"
							as="link"
						/>
					))}
				</div>
				<ScrollBar orientation="horizontal" className="mt-8" />
			</ScrollArea>
		</div>
	);
}
