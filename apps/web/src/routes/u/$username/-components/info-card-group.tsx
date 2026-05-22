import { getRouteApi, Link } from '@tanstack/react-router';
import { cn } from '@wanderlust/ui/lib/utils';
import { formatDate } from 'date-fns';
import { LeafIcon } from 'lucide-react';
import { InfoCard } from '@/components/info-card';

type Props = {
	className?: string;
};

export function InfoCardGroup({ className }: Props) {
	const rootRoute = getRouteApi('/u/$username');
	const { profile } = rootRoute.useLoaderData();
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'decimal',
		compactDisplay: 'short',
		notation: 'compact',
	});

	return (
		<div className={cn('grid grid-cols-1 gap-4 md:grid-cols-3', className)}>
			<Link to="/u/$username/followers" params={{ username: profile.username }}>
				<InfoCard.Root className="aspect-9/2">
					<InfoCard.Content>
						<InfoCard.NumberColumn>
							{formatter.format(profile.followersCount)}
						</InfoCard.NumberColumn>
						<InfoCard.DescriptionColumn>
							<div className="flex items-center text-primary">Followers</div>
						</InfoCard.DescriptionColumn>
					</InfoCard.Content>
				</InfoCard.Root>
			</Link>

			<Link to="/u/$username/following" params={{ username: profile.username }}>
				<InfoCard.Root className="aspect-9/2">
					<InfoCard.Content>
						<InfoCard.NumberColumn>
							{formatter.format(profile.followingCount)}
						</InfoCard.NumberColumn>
						<InfoCard.DescriptionColumn>
							<div className="flex items-center text-primary">Following</div>
						</InfoCard.DescriptionColumn>
					</InfoCard.Content>
				</InfoCard.Root>
			</Link>

			<InfoCard.Root className="aspect-9/2">
				<InfoCard.Content>
					<InfoCard.NumberColumn>
						<LeafIcon className="size-16 text-primary" />
					</InfoCard.NumberColumn>
					<InfoCard.DescriptionColumn>
						<div className="flex items-center text-primary">Joined</div>

						<span className="text-muted-foreground text-xs tracking-tight">
							{formatDate(profile.createdAt, 'PPP')}
						</span>
					</InfoCard.DescriptionColumn>
				</InfoCard.Content>
			</InfoCard.Root>
		</div>
	);
}
