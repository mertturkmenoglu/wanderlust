import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { ScrollArea, ScrollBar } from '@wanderlust/ui/components/scroll-area';
import { cn } from '@wanderlust/ui/lib/utils';
import { PlaceCard } from '@/components/place-card';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { UnderlineLink } from '@/components/underline-link';
import { orpc } from '@/lib/orpc';

type Props = {
	className?: string;
};

export function Collections({ className }: Props) {
	return (
		<SuspenseWrapper>
			<Content className={className} />
		</SuspenseWrapper>
	);
}

type ContentProps = {
	className?: string;
};

function Content({ className }: ContentProps) {
	const route = getRouteApi('/p/$id/');
	const { id } = route.useParams();
	const query = useSuspenseQuery(
		orpc.collections.listByPlaceId.queryOptions({
			input: {
				placeId: id,
			},
		}),
	);

	return (
		<div className={cn(className)}>
			<div className="mt-8 space-y-8">
				{query.data.collections.map((collection) => (
					<div key={collection.id}>
						<div key={collection.id} className="mb-4 flex items-baseline gap-4">
							<h3 className="font-bold text-2xl">{collection.name}</h3>
							<UnderlineLink to="/c/$id" params={{ id: collection.id }}>
								See more
							</UnderlineLink>
						</div>

						<ScrollArea>
							<div className="my-4 flex gap-8">
								{collection.items.map((item) => (
									<PlaceCard
										key={item.placeId}
										as="link"
										place={item.place}
										meta={item.meta}
										className="w-[256px]"
									/>
								))}
							</div>
							<ScrollBar orientation="horizontal" className="mt-8" />
						</ScrollArea>
					</div>
				))}
			</div>
		</div>
	);
}
