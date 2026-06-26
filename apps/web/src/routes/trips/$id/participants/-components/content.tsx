import { Link, useLoaderData } from '@tanstack/react-router';
import { Badge } from '@wanderlust/ui/components/badge';
import { buttonVariants } from '@wanderlust/ui/components/button';
import { DockIcon } from 'lucide-react';
import { DenseList } from '@/components/dense-list';
import { useTripParticipantsContext } from './context';
import { ParticipantItem } from './item';

export function Content() {
	const ctx = useTripParticipantsContext();
	const { trip } = useLoaderData({ from: '/trips/$id' });

	return (
		<div>
			<div className="flex flex-row items-center justify-between gap-4">
				<div>
					<div className="font-medium text-lg leading-snug">Participants</div>
					<div className="text-muted-foreground text-sm leading-snug">
						See the trip participants
					</div>
				</div>

				{ctx.canInvite && (
					<div className="flex flex-row items-center gap-2">
						<Badge variant="midnight">
							{ctx.allParticipants.length} Participants
						</Badge>

						<Link
							to="/trips/$id/participants/invites"
							params={{
								id: trip.id,
							}}
							className={buttonVariants({
								variant: 'ghost',
								size: 'sm',
								className: 'ml-auto',
							})}
						>
							<DockIcon className="size-4" />
							<span>Invites</span>
						</Link>
					</div>
				)}
			</div>

			<DenseList
				data={ctx.allParticipants}
				className="mt-4"
				keyExtractor={(p) => `trip-participant-${p.userId}`}
				renderItem={(p, className) => (
					<ParticipantItem participant={p} className={className} />
				)}
			/>
		</div>
	);
}
