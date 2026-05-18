import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, Link } from '@tanstack/react-router';
import { ScrollArea, ScrollBar } from '@wanderlust/ui/components/scroll-area';
import { cn } from '@wanderlust/ui/lib/utils';
import { PlaceCard } from '@/components/place-card';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
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
							<Link
								to="/c/$id"
								params={{
									id: collection.id,
								}}
								className="text-base text-primary decoration-2 decoration-primary underline-offset-4 hover:underline"
							>
								See more
							</Link>
						</div>

						<ScrollArea>
							<div className="my-4 flex gap-8">
								{collection.items.map((item) => (
									<Link
										key={item.placeId}
										to="/p/$id"
										params={{
											id: item.placeId,
										}}
									>
										<PlaceCard place={item.place} className="w-[256px]" />
									</Link>
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
