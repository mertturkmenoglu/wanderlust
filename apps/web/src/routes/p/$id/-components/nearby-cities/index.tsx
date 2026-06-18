import { Link, useLoaderData } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@wanderlust/ui/components/card';
import { ScrollArea, ScrollBar } from '@wanderlust/ui/components/scroll-area';
import { cn } from '@wanderlust/ui/lib/utils';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { useNearbyCities } from './hooks';

type Props = {
	className?: string;
};

export function NearbyCities(props: Props) {
	return (
		<SuspenseWrapper placeholderVariant="spinner">
			<Content {...props} />
		</SuspenseWrapper>
	);
}

function Content({ className }: Props) {
	const query = useNearbyCities();
	const { place } = useLoaderData({ from: '/p/$id/' });

	const cities = query.data.hits
		.map((c) => c.document.city)
		.filter((c) => c.id !== place.address.cityId);

	if (cities.length === 0) {
		return null;
	}

	return (
		<div className={cn(className)}>
			<h3 className="font-semibold text-xl tracking-tight">Nearby Cities</h3>

			<ScrollArea type="always">
				<div className="my-4 flex gap-4">
					{cities.map((c) => (
						<Card className="w-60">
							<img src={c.image} alt="" className="aspect-video w-full" />
							<CardHeader>
								<CardTitle>{c.name}</CardTitle>
								<CardDescription className="line-clamp-1">
									{c.stateName} / {c.countryName}
								</CardDescription>
							</CardHeader>
							<CardFooter>
								<Link
									to="/cities/$"
									params={{
										_splat: `${c.id}`,
									}}
									className={buttonVariants({
										variant: 'midnight',
										className: 'w-full',
									})}
								>
									View
								</Link>
							</CardFooter>
						</Card>
					))}
				</div>

				<ScrollBar orientation="horizontal" className="mt-8" />
			</ScrollArea>
		</div>
	);
}
