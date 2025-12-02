import { Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty';

export function EmptyState() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia>
					<img
						src="/logo.png"
						alt=""
						className="size-24 min-h-24 min-w-24 grayscale"
					/>
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
