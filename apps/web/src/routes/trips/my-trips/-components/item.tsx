import { Link } from '@tanstack/react-router';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRightIcon, GlobeIcon, LockIcon, UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@/components/ui/item';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Outputs } from '@/lib/orpc';

type Props = {
	trip: Outputs['trips']['list']['trips'][number];
};

export function TripItem({ trip }: Props) {
	return (
		<Link
			to="/trips/$id"
			params={{
				id: trip.id,
			}}
		>
			<Item variant="outline" className="hover:bg-muted">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger>
							<ItemMedia variant="icon">
								{trip.visibilityLevel === 'public' ? (
									<GlobeIcon />
								) : trip.visibilityLevel === 'friends' ? (
									<UsersIcon />
								) : (
									<LockIcon />
								)}
							</ItemMedia>
						</TooltipTrigger>
						<TooltipContent>
							<p>
								{trip.visibilityLevel === 'public'
									? 'Everyone can see this trip'
									: trip.visibilityLevel === 'friends'
										? 'Only participants can see this trip'
										: 'Only you can see this trip'}
							</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
				<ItemContent>
					<ItemTitle>{trip.title}</ItemTitle>

					<ItemDescription
						title={`Created at ${trip.createdAt.toLocaleString()}`}
					>
						<div>
							Created {formatDistanceToNow(trip.createdAt)} ago by{' '}
							{trip.owner.name}
						</div>
					</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Button variant="ghost" size="icon">
						<ArrowRightIcon />
					</Button>
				</ItemActions>
			</Item>
		</Link>
	);
}
