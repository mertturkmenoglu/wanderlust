import { Link } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@wanderlust/ui/components/tooltip';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRightIcon } from 'lucide-react';
import { useVisibilityLevelIcon, useVisibilityLevelTooltip } from './-hooks';
import type { TripItemProps } from './-types';

export function TripItem({ trip }: TripItemProps) {
	const Icon = useVisibilityLevelIcon(trip.visibilityLevel);
	const tooltip = useVisibilityLevelTooltip(trip.visibilityLevel);
	const description = `Created ${formatDistanceToNow(trip.createdAt)} ago by ${trip.owner.name}`;

	return (
		<Link
			to="/trips/$id"
			params={{
				id: trip.id,
			}}
		>
			<Item variant="outline" className="hover:bg-muted">
				<Tooltip>
					<TooltipTrigger>
						<ItemMedia variant="icon">
							<Icon />
						</ItemMedia>
					</TooltipTrigger>
					<TooltipContent>{tooltip}</TooltipContent>
				</Tooltip>
				<ItemContent>
					<ItemTitle>{trip.title}</ItemTitle>

					<ItemDescription title={description}>
						<div>{description}</div>
					</ItemDescription>
				</ItemContent>
				<ItemActions>
					<div className={buttonVariants({ variant: 'ghost', size: 'icon' })}>
						<ArrowRightIcon />
					</div>
				</ItemActions>
			</Item>
		</Link>
	);
}
