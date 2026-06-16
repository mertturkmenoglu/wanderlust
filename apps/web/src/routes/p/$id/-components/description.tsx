/** biome-ignore-all lint/suspicious/noArrayIndexKey: TODO */
import { getRouteApi } from '@tanstack/react-router';
import { cn } from '@wanderlust/ui/lib/utils';
import { DollarSignIcon, HeartIcon, PersonStandingIcon } from 'lucide-react';
import { CollapsibleText } from '@/components/collapsible-text';
import { FormattedRating } from '@/components/formatted-rating';
import { InfoCard } from '@/components/info-card';
import { useNumberFormatter } from '@/hooks/use-number-formatter';
import { computeRating } from '@/lib/rating';

type Props = {
	className?: string;
};

export function Description({ className }: Props) {
	const route = getRouteApi('/p/$id/');
	const { place } = route.useLoaderData();
	const rating = computeRating(place.totalPoints, place.totalVotes);
	const fmt = useNumberFormatter();

	return (
		<div className={cn('grid grid-cols-1 gap-4', className)}>
			<div className="flex flex-col">
				<h3 className="font-semibold text-xl">Description</h3>
				<CollapsibleText text={place.description} charLimit={1000} />
			</div>

			<div className="grid h-min grid-cols-2 grid-rows-2 gap-2 md:grid-cols-4 md:grid-rows-1">
				<InfoCard.Root>
					<InfoCard.Content>
						<InfoCard.NumberColumn className="md:text-3xl lg:text-6xl">
							{computeRating(place.totalPoints, place.totalVotes)}
						</InfoCard.NumberColumn>
						<InfoCard.DescriptionColumn>
							<FormattedRating
								rating={Number.parseFloat(rating)}
								votes={place.totalVotes}
								showNumbers={false}
							/>
							<span className="text-muted-foreground text-xs tracking-tight">
								{fmt.format(place.totalVotes)} reviews
							</span>
						</InfoCard.DescriptionColumn>
					</InfoCard.Content>
				</InfoCard.Root>

				<InfoCard.Root>
					<InfoCard.Content>
						<InfoCard.NumberColumn className="md:text-3xl lg:text-6xl">
							{fmt.format(place.totalFavorites)}
						</InfoCard.NumberColumn>
						<InfoCard.DescriptionColumn>
							<div className="flex items-center gap-1">
								<HeartIcon className="size-4 fill-primary text-primary" />
								<HeartIcon className="size-4 fill-primary text-primary" />
								<HeartIcon className="size-4 fill-primary text-primary" />
							</div>
							<span className="text-muted-foreground text-xs tracking-tight">
								Favorites
							</span>
						</InfoCard.DescriptionColumn>
					</InfoCard.Content>
				</InfoCard.Root>

				<InfoCard.Root>
					<InfoCard.Content>
						<InfoCard.NumberColumn className="md:text-3xl lg:text-6xl">
							{place.priceLevel}/5
						</InfoCard.NumberColumn>
						<InfoCard.DescriptionColumn>
							<div className="flex items-center">
								{Array.from({ length: place.priceLevel }).map((_, i) => (
									<DollarSignIcon className="size-4 text-primary" key={i} />
								))}
							</div>

							<span className="text-muted-foreground text-xs tracking-tight">
								Price Level
							</span>
						</InfoCard.DescriptionColumn>
					</InfoCard.Content>
				</InfoCard.Root>

				<InfoCard.Root>
					<InfoCard.Content>
						<InfoCard.NumberColumn className="md:text-3xl lg:text-6xl">
							{place.accessibilityLevel}/5
						</InfoCard.NumberColumn>
						<InfoCard.DescriptionColumn>
							<div className="flex items-center">
								{Array.from({ length: place.accessibilityLevel }).map(
									(_, i) => (
										<PersonStandingIcon
											className="size-4 text-primary"
											key={i}
										/>
									),
								)}
							</div>

							<span className="line-clamp-1 text-muted-foreground text-xs tracking-tight">
								Accessibility{' '}
								<span className="sr-only md:not-sr-only">Level</span>
							</span>
						</InfoCard.DescriptionColumn>
					</InfoCard.Content>
				</InfoCard.Root>
			</div>
		</div>
	);
}
