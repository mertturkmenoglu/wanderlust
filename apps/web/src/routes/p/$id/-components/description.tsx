/** biome-ignore-all lint/suspicious/noArrayIndexKey: TODO */
import { getRouteApi } from '@tanstack/react-router';
import { DollarSignIcon, HeartIcon, PersonStandingIcon } from 'lucide-react';
import { CollapsibleText } from '@/components/blocks/collapsible-text';
import { FormattedRating } from '@/components/kit/formatted-rating';
import { InfoCard } from '@/components/kit/info-card';
import { computeRating } from '@/lib/rating';
import { cn } from '@/lib/utils';
import { PlanTripDialog } from './plan-trip-dialog';

type Props = {
	className?: string;
};

export function Description({ className }: Props) {
	const route = getRouteApi('/p/$id/');
	const { place } = route.useLoaderData();
	const rating = computeRating(place.totalPoints, place.totalVotes);
	const fmt = Intl.NumberFormat('en-US', {
		style: 'decimal',
		compactDisplay: 'short',
		notation: 'compact',
	});

	return (
		<div className={cn('grid grid-cols-1 gap-4 md:grid-cols-2', className)}>
			<div className="flex flex-col">
				<h3 className="font-semibold text-xl">Description</h3>
				<CollapsibleText text={place.description} charLimit={1000} />

				<PlanTripDialog />
			</div>

			<div className="grid h-min grid-cols-2 grid-rows-2 gap-2">
				<InfoCard.Root>
					<InfoCard.Content>
						<InfoCard.NumberColumn>
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
						<InfoCard.NumberColumn>
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
						<InfoCard.NumberColumn>{place.priceLevel}/5</InfoCard.NumberColumn>
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
						<InfoCard.NumberColumn>
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

							<span className="text-muted-foreground text-xs tracking-tight">
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
