import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@wanderlust/ui/components/empty';
import { Logo } from '@/components/logo';

export function EmptyState() {
	return (
		<div>
			<Empty>
				<EmptyHeader>
					<EmptyMedia>
						<Logo variant="default" grayscale />
					</EmptyMedia>
					<EmptyTitle>No invites</EmptyTitle>
					<EmptyDescription>
						Invite users to join you on this trip.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		</div>
	);
}
