import { Link } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@wanderlust/ui/components/empty';
import { PlusIcon } from 'lucide-react';
import { Logo } from '@/components/logo';

export function EmptyState() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia>
					<Logo variant="default" grayscale />
				</EmptyMedia>
				<EmptyTitle>No trips found</EmptyTitle>
				<EmptyDescription>
					You haven't created any trips yet. Start by creating one or join via
					an invite!
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Link
					to="/trips"
					search={{
						showNewDialog: true,
					}}
					className={buttonVariants({})}
				>
					<PlusIcon />
					<span>New Trip</span>
				</Link>
			</EmptyContent>
		</Empty>
	);
}
