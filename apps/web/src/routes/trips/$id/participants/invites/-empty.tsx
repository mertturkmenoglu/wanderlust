import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@wanderlust/ui/components/empty';
import { Logo } from '@/components/logo';
import { Header } from './-header';

export function EmptyState() {
	return (
		<div>
			<Header />

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
